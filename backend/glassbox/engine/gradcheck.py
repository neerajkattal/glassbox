"""Numerical gradient checking: the engine's built-in lie detector.

Backpropagation gives exact gradients cheaply; finite differences give
approximate gradients expensively. If the two agree, backprop is right.
"""

from __future__ import annotations

from collections.abc import Callable, Sequence

import numpy as np

from glassbox.engine.tensor import Tensor


def numerical_grad(fn: Callable[[], Tensor], param: Tensor, eps: float = 1e-6) -> np.ndarray:
    """Central-difference estimate of d fn() / d param."""
    grad = np.zeros_like(param.data)
    it = np.nditer(param.data, flags=["multi_index"])
    for _ in it:
        idx = it.multi_index
        original = param.data[idx]
        param.data[idx] = original + eps
        plus = fn().item()
        param.data[idx] = original - eps
        minus = fn().item()
        param.data[idx] = original
        grad[idx] = (plus - minus) / (2 * eps)
    return grad


def check_gradients(
    fn: Callable[[], Tensor], params: Sequence[Tensor], eps: float = 1e-6
) -> float:
    """Return the worst relative error between analytic and numerical gradients."""
    for p in params:
        p.zero_grad()
    fn().backward()
    worst = 0.0
    for p in params:
        analytic = p.grad if p.grad is not None else np.zeros_like(p.data)
        numeric = numerical_grad(fn, p, eps)
        denom = np.maximum(1e-8, np.abs(analytic) + np.abs(numeric))
        worst = max(worst, float((np.abs(analytic - numeric) / denom).max()))
    return worst
