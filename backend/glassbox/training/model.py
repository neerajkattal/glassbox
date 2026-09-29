"""The Digit Island network: the same shape as the classic 784-16-16-10 example."""

from __future__ import annotations

import numpy as np

from glassbox.engine import Linear, Sequential, Sigmoid

INPUT_SIZE = 28 * 28
HIDDEN_SIZES = (16, 16)
NUM_CLASSES = 10


def build_digit_net(seed: int, hidden: tuple[int, ...] = HIDDEN_SIZES) -> Sequential:
    """Build an MLP with sigmoid hidden layers, so every "bulb" glows between 0 and 1."""
    rng = np.random.default_rng(seed)
    layers = []
    width = INPUT_SIZE
    for size in hidden:
        layers += [Linear(width, size, rng), Sigmoid()]
        width = size
    layers.append(Linear(width, NUM_CLASSES, rng))
    return Sequential(*layers)
