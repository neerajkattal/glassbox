"""A minimal reverse-mode autograd tensor built on NumPy.

Every operation records the tensors it came from and a small closure that
knows how to push gradients back to them. Calling ``backward()`` on a scalar
walks that graph in reverse topological order and applies the chain rule.
"""

from __future__ import annotations

from collections.abc import Callable, Iterable

import numpy as np

ArrayLike = np.ndarray | float | int | list


def _unbroadcast(grad: np.ndarray, shape: tuple[int, ...]) -> np.ndarray:
    """Sum ``grad`` down to ``shape``, undoing NumPy broadcasting."""
    while grad.ndim > len(shape):
        grad = grad.sum(axis=0)
    for axis, size in enumerate(shape):
        if size == 1 and grad.shape[axis] != 1:
            grad = grad.sum(axis=axis, keepdims=True)
    return grad


class Tensor:
    """An n-dimensional array that remembers how it was computed."""

    __array_priority__ = 1000  # make ``ndarray * Tensor`` defer to Tensor

    def __init__(
        self,
        data: ArrayLike,
        requires_grad: bool = False,
        _parents: Iterable[Tensor] = (),
        _op: str = "",
    ) -> None:
        self.data = np.asarray(data, dtype=np.float64)
        self.requires_grad = requires_grad
        self.grad: np.ndarray | None = None
        self._parents = tuple(_parents)
        self._op = _op
        self._backward: Callable[[], None] = lambda: None

    # ------------------------------------------------------------------ basics
    @property
    def shape(self) -> tuple[int, ...]:
        return self.data.shape

    @property
    def ndim(self) -> int:
        return self.data.ndim

    def item(self) -> float:
        return float(self.data)

    def numpy(self) -> np.ndarray:
        return self.data

    def zero_grad(self) -> None:
        self.grad = None

    def __repr__(self) -> str:
        grad = ", requires_grad=True" if self.requires_grad else ""
        return f"Tensor({self.data!r}{grad})"

    @staticmethod
    def _wrap(other: Tensor | ArrayLike) -> Tensor:
        return other if isinstance(other, Tensor) else Tensor(other)

    def _accumulate(self, grad: np.ndarray) -> None:
        if not self.requires_grad:
            return
        grad = _unbroadcast(grad, self.data.shape)
        self.grad = grad.copy() if self.grad is None else self.grad + grad

    def _child(self, data: np.ndarray, parents: tuple[Tensor, ...], op: str) -> Tensor:
        needs_grad = any(p.requires_grad for p in parents)
        return Tensor(data, requires_grad=needs_grad, _parents=parents, _op=op)

    # -------------------------------------------------------------- arithmetic
    def __add__(self, other: Tensor | ArrayLike) -> Tensor:
        other = self._wrap(other)
        out = self._child(self.data + other.data, (self, other), "add")

        def _backward() -> None:
            self._accumulate(out.grad)
            other._accumulate(out.grad)

        out._backward = _backward
        return out

    def __mul__(self, other: Tensor | ArrayLike) -> Tensor:
        other = self._wrap(other)
        out = self._child(self.data * other.data, (self, other), "mul")

        def _backward() -> None:
            self._accumulate(out.grad * other.data)
            other._accumulate(out.grad * self.data)

        out._backward = _backward
        return out

    def __neg__(self) -> Tensor:
        return self * -1.0

    def __sub__(self, other: Tensor | ArrayLike) -> Tensor:
        return self + (-self._wrap(other))

    __radd__ = __add__
    __rmul__ = __mul__

    def __rsub__(self, other: Tensor | ArrayLike) -> Tensor:
        return self._wrap(other) - self

    # ---------------------------------------------------------------- autograd
    def backward(self, grad: np.ndarray | None = None) -> None:
        """Back-propagate from this tensor through the whole graph."""
        if grad is None:
            if self.data.size != 1:
                raise ValueError("backward() without a gradient needs a scalar tensor")
            grad = np.ones_like(self.data)

        order: list[Tensor] = []
        visited: set[int] = set()

        def visit(node: Tensor) -> None:
            if id(node) in visited:
                return
            visited.add(id(node))
            for parent in node._parents:
                visit(parent)
            order.append(node)

        visit(self)
        self.grad = np.asarray(grad, dtype=np.float64)
        for node in reversed(order):
            if node.grad is not None:
                node._backward()
