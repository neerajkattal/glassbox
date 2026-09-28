"""Layers. A network is just a stack of these, each one a tiny function."""

from __future__ import annotations

from collections.abc import Iterator

import numpy as np

from glassbox.engine.tensor import Tensor


class Module:
    """Base class: anything with parameters and a forward pass."""

    def forward(self, x: Tensor) -> Tensor:
        raise NotImplementedError

    def __call__(self, x: Tensor) -> Tensor:
        return self.forward(x)

    def parameters(self) -> list[Tensor]:
        return [p for _, p in self.named_parameters()]

    def named_parameters(self) -> Iterator[tuple[str, Tensor]]:
        for name, value in vars(self).items():
            if isinstance(value, Tensor) and value.requires_grad:
                yield name, value
            elif isinstance(value, Module):
                for sub, p in value.named_parameters():
                    yield f"{name}.{sub}", p
            elif isinstance(value, list):
                for i, item in enumerate(value):
                    if isinstance(item, Module):
                        for sub, p in item.named_parameters():
                            yield f"{name}.{i}.{sub}", p

    def zero_grad(self) -> None:
        for p in self.parameters():
            p.zero_grad()


class Linear(Module):
    """``y = x @ W + b``: every output neuron is a weighted vote of every input.

    The weights are the "knobs" the network turns while learning.
    """

    def __init__(self, in_features: int, out_features: int, rng: np.random.Generator) -> None:
        self.in_features = in_features
        self.out_features = out_features
        # He initialisation keeps signals from shrinking or exploding through ReLUs.
        scale = np.sqrt(2.0 / in_features)
        self.weight = Tensor(rng.normal(0.0, scale, (in_features, out_features)), True)
        self.bias = Tensor(np.zeros(out_features), True)

    def forward(self, x: Tensor) -> Tensor:
        return x @ self.weight + self.bias


class ReLU(Module):
    def forward(self, x: Tensor) -> Tensor:
        return x.relu()


class Sigmoid(Module):
    def forward(self, x: Tensor) -> Tensor:
        return x.sigmoid()


class Sequential(Module):
    """Runs layers one after another, optionally recording every activation."""

    def __init__(self, *layers: Module) -> None:
        self.layers = list(layers)

    def forward(self, x: Tensor) -> Tensor:
        for layer in self.layers:
            x = layer(x)
        return x

    def trace(self, x: Tensor) -> list[np.ndarray]:
        """Forward pass that returns the output of every layer (for visualising)."""
        outputs = []
        for layer in self.layers:
            x = layer(x)
            outputs.append(x.data)
        return outputs
