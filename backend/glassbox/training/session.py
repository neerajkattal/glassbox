"""A training session: one learner's robot, its data stream and its history."""

from __future__ import annotations

import math
import time
import uuid
from dataclasses import asdict, dataclass

import numpy as np

from glassbox.data.loader import BatchSampler
from glassbox.data.mnist import Mnist
from glassbox.engine import SGD, Sigmoid, Tensor, accuracy, cross_entropy, softmax
from glassbox.training.model import INPUT_SIZE, build_digit_net

# Above this loss the robot is doing worse than random guessing (ln 10 ≈ 2.3)
# by a wide margin: the step size was too big and training has blown up.
EXPLODED_LOSS = 5.0
LOSS_SMOOTHING = 0.9


@dataclass
class Hyperparams:
    learning_rate: float = 1.0
    batch_size: int = 32


@dataclass
class Snapshot:
    step: int
    samples_seen: int
    epoch: int
    loss: float | None
    accuracy: float
    learning_rate: float
    batch_size: int
    exploded: bool

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass
class Prediction:
    prediction: int
    probabilities: list[float]
    activations: list[list[float]]

    def to_dict(self) -> dict:
        return asdict(self)


class TrainingSession:
    def __init__(self, data: Mnist, seed: int | None = None, eval_size: int = 1000) -> None:
        self.id = uuid.uuid4().hex
        self.seed = seed if seed is not None else int(np.random.default_rng().integers(1 << 31))
        self.data = data
        self.eval_images = data.test.images[:eval_size]
        self.eval_labels = data.test.labels[:eval_size]
        self.hyperparams = Hyperparams()
        self.last_used = time.monotonic()
        self.reset()

    # ----------------------------------------------------------------- control
    def reset(self) -> None:
        """Throw the robot's brain away and start from random knobs."""
        self.model = build_digit_net(self.seed)
        self.optimizer = SGD(self.model.parameters(), lr=self.hyperparams.learning_rate)
        self.sampler = BatchSampler(self.data.train, np.random.default_rng(self.seed))
        self.step_count = 0
        self.samples_seen = 0
        self.smoothed_loss: float | None = None
        self.exploded = False
        self._accuracy = self._evaluate()

    def update_hyperparams(
        self, learning_rate: float | None = None, batch_size: int | None = None
    ) -> None:
        if learning_rate is not None:
            self.hyperparams.learning_rate = learning_rate
            self.optimizer.lr = learning_rate
        if batch_size is not None:
            self.hyperparams.batch_size = batch_size

    def touch(self) -> None:
        self.last_used = time.monotonic()

    # ---------------------------------------------------------------- training
    def train(self, steps: int) -> Snapshot:
        """Run ``steps`` gradient-descent steps and report how it went."""
        self.touch()
        for _ in range(steps):
            if self.exploded:
                break
            images, labels = self.sampler.next(self.hyperparams.batch_size)
            self.optimizer.zero_grad()
            loss = cross_entropy(self.model(Tensor(images)), labels)
            loss.backward()
            self.optimizer.step()

            value = loss.item()
            self.step_count += 1
            self.samples_seen += len(labels)
            if not math.isfinite(value):
                self.exploded = True
                break
            if self.smoothed_loss is None:
                self.smoothed_loss = value
            else:
                self.smoothed_loss = (
                    LOSS_SMOOTHING * self.smoothed_loss + (1 - LOSS_SMOOTHING) * value
                )
            if self.smoothed_loss > EXPLODED_LOSS:
                self.exploded = True
        self._accuracy = self._evaluate()
        return self.snapshot()

    def _evaluate(self) -> float:
        logits = self.model(Tensor(self.eval_images)).data
        if not np.isfinite(logits).all():
            return 0.0
        return accuracy(logits, self.eval_labels)

    def snapshot(self) -> Snapshot:
        loss = self.smoothed_loss
        return Snapshot(
            step=self.step_count,
            samples_seen=self.samples_seen,
            epoch=self.sampler.epoch,
            loss=round(loss, 5) if loss is not None and math.isfinite(loss) else None,
            accuracy=round(self._accuracy, 4),
            learning_rate=self.hyperparams.learning_rate,
            batch_size=self.hyperparams.batch_size,
            exploded=self.exploded,
        )

    # --------------------------------------------------------------- inspection
    def predict(self, pixels: np.ndarray) -> Prediction:
        """Show one drawing to the robot and record every bulb along the way."""
        self.touch()
        x = Tensor(np.asarray(pixels, dtype=np.float64).reshape(1, INPUT_SIZE))
        outputs = self.model.trace(x)
        # The sigmoid outputs are the hidden "bulbs", each glowing between 0 and 1.
        hidden = [
            out[0]
            for layer, out in zip(self.model.layers, outputs, strict=True)
            if isinstance(layer, Sigmoid)
        ]
        logits = np.nan_to_num(outputs[-1][0], nan=0.0, posinf=1e6, neginf=-1e6)
        probs = softmax(logits)
        return Prediction(
            prediction=int(probs.argmax()),
            probabilities=[round(float(p), 5) for p in probs],
            activations=[[round(float(a), 4) for a in layer] for layer in hidden],
        )

    def first_layer_weights(self) -> list[list[float]]:
        """The 784 knobs feeding each first-layer bulb: what pattern it looks for."""
        weight = self.model.layers[0].weight.data  # (784, hidden)
        return [[round(float(w), 4) for w in column] for column in weight.T]
