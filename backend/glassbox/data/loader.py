"""Mini-batch sampling."""

from __future__ import annotations

from collections.abc import Iterator

import numpy as np

from glassbox.data.mnist import Split


class BatchSampler:
    """Endless stream of shuffled mini-batches; reshuffles after every epoch."""

    def __init__(self, split: Split, rng: np.random.Generator) -> None:
        self.split = split
        self.rng = rng
        self.epoch = 0
        self._order = rng.permutation(len(split))
        self._cursor = 0

    def next(self, batch_size: int) -> tuple[np.ndarray, np.ndarray]:
        if self._cursor + batch_size > len(self._order):
            self._order = self.rng.permutation(len(self.split))
            self._cursor = 0
            self.epoch += 1
        idx = self._order[self._cursor : self._cursor + batch_size]
        self._cursor += batch_size
        return self.split.images[idx], self.split.labels[idx]

    def __iter__(self) -> Iterator[tuple[np.ndarray, np.ndarray]]:
        while True:
            yield self.next(32)
