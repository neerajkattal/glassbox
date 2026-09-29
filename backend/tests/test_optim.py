import numpy as np
import pytest

from glassbox.engine import Tensor
from glassbox.engine.optim import SGD, Adam


def minimise(optimizer_cls, steps=300, **kwargs):
    x = Tensor(np.array([5.0, -3.0]), requires_grad=True)
    opt = optimizer_cls([x], **kwargs)
    for _ in range(steps):
        opt.zero_grad()
        ((x - 1.0) ** 2).sum().backward()
        opt.step()
    return x.data


def test_sgd_walks_downhill_to_the_minimum():
    np.testing.assert_allclose(minimise(SGD, lr=0.1), [1.0, 1.0], atol=1e-6)


def test_sgd_momentum_also_converges():
    np.testing.assert_allclose(minimise(SGD, lr=0.05, momentum=0.9), [1.0, 1.0], atol=1e-3)


def test_adam_converges():
    np.testing.assert_allclose(minimise(Adam, steps=2000, lr=0.05), [1.0, 1.0], atol=1e-3)


def test_too_large_learning_rate_diverges():
    """The "break it" lesson: a step that is too big overshoots the valley."""
    x = minimise(SGD, steps=20, lr=1.5)
    assert np.abs(x - 1.0).max() > 1e3


def test_step_skips_parameters_without_gradients():
    x = Tensor([1.0], requires_grad=True)
    SGD([x], lr=1.0).step()
    assert x.data[0] == pytest.approx(1.0)
