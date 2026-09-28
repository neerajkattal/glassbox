"""Stateless building blocks: softmax, log-softmax and the losses built on them."""

from __future__ import annotations

import numpy as np

from glassbox.engine.tensor import Tensor


def softmax(logits: np.ndarray, axis: int = -1) -> np.ndarray:
    """Plain NumPy softmax, used for showing probabilities (no gradients)."""
    shifted = logits - logits.max(axis=axis, keepdims=True)
    exp = np.exp(shifted)
    return exp / exp.sum(axis=axis, keepdims=True)


def log_softmax(x: Tensor, axis: int = -1) -> Tensor:
    """Numerically stable log-softmax with a fused backward pass."""
    shifted = x.data - x.data.max(axis=axis, keepdims=True)
    log_probs = shifted - np.log(np.exp(shifted).sum(axis=axis, keepdims=True))
    out = Tensor(log_probs, requires_grad=x.requires_grad, _parents=(x,), _op="log_softmax")

    def _backward() -> None:
        probs = np.exp(log_probs)
        grad = out.grad - probs * out.grad.sum(axis=axis, keepdims=True)
        x._accumulate(grad)

    out._backward = _backward
    return out


def cross_entropy(logits: Tensor, targets: np.ndarray) -> Tensor:
    """Mean negative log-likelihood of integer class ``targets``.

    In plain words: how surprised the network was by the right answer,
    averaged over the batch. Zero means it was completely sure and correct.
    """
    targets = np.asarray(targets, dtype=np.int64)
    batch = logits.shape[0]
    one_hot = np.zeros_like(logits.data)
    one_hot[np.arange(batch), targets] = 1.0
    return -(log_softmax(logits) * one_hot).sum() * (1.0 / batch)


def accuracy(logits: np.ndarray, targets: np.ndarray) -> float:
    """Fraction of rows whose highest logit is the target class."""
    return float((logits.argmax(axis=1) == np.asarray(targets)).mean())
