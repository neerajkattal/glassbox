"""Optimizers: the rules for turning gradients into knob adjustments."""

from __future__ import annotations

from collections.abc import Sequence

import numpy as np

from glassbox.engine.tensor import Tensor


class Optimizer:
    def __init__(self, params: Sequence[Tensor], lr: float) -> None:
        self.params = list(params)
        self.lr = lr

    def zero_grad(self) -> None:
        for p in self.params:
            p.zero_grad()

    def step(self) -> None:
        raise NotImplementedError


class SGD(Optimizer):
    """Gradient descent: take a small step downhill, optionally with momentum."""

    def __init__(self, params: Sequence[Tensor], lr: float = 0.1, momentum: float = 0.0) -> None:
        super().__init__(params, lr)
        self.momentum = momentum
        self._velocity = [np.zeros_like(p.data) for p in self.params]

    def step(self) -> None:
        for p, v in zip(self.params, self._velocity, strict=True):
            if p.grad is None:
                continue
            v *= self.momentum
            v -= self.lr * p.grad
            p.data += v


class Adam(Optimizer):
    """Adam: gradient descent with per-knob adaptive step sizes."""

    def __init__(
        self,
        params: Sequence[Tensor],
        lr: float = 1e-3,
        betas: tuple[float, float] = (0.9, 0.999),
        eps: float = 1e-8,
    ) -> None:
        super().__init__(params, lr)
        self.beta1, self.beta2 = betas
        self.eps = eps
        self._m = [np.zeros_like(p.data) for p in self.params]
        self._v = [np.zeros_like(p.data) for p in self.params]
        self._t = 0

    def step(self) -> None:
        self._t += 1
        for p, m, v in zip(self.params, self._m, self._v, strict=True):
            if p.grad is None:
                continue
            m[:] = self.beta1 * m + (1 - self.beta1) * p.grad
            v[:] = self.beta2 * v + (1 - self.beta2) * p.grad**2
            m_hat = m / (1 - self.beta1**self._t)
            v_hat = v / (1 - self.beta2**self._t)
            p.data -= self.lr * m_hat / (np.sqrt(v_hat) + self.eps)
