import numpy as np
import pytest

from glassbox.engine import Tensor


def test_add_and_mul_gradients():
    a = Tensor(2.0, requires_grad=True)
    b = Tensor(-3.0, requires_grad=True)
    out = a * b + a
    out.backward()
    assert out.item() == pytest.approx(-4.0)
    assert a.grad == pytest.approx(-2.0)  # b + 1
    assert b.grad == pytest.approx(2.0)  # a


def test_gradient_accumulates_when_tensor_is_reused():
    a = Tensor(3.0, requires_grad=True)
    out = a * a * a
    out.backward()
    assert a.grad == pytest.approx(27.0)  # 3 * a^2


def test_broadcast_gradient_is_summed_back_to_shape():
    w = Tensor(np.ones((2, 3)), requires_grad=True)
    b = Tensor(np.zeros(3), requires_grad=True)
    out = w + b
    out.backward(np.ones((2, 3)))
    assert b.grad.shape == (3,)
    np.testing.assert_allclose(b.grad, [2.0, 2.0, 2.0])


def test_backward_requires_scalar_without_explicit_grad():
    t = Tensor(np.ones(3), requires_grad=True)
    with pytest.raises(ValueError):
        (t * 2).backward()


def test_constants_do_not_collect_gradients():
    a = Tensor(1.0, requires_grad=True)
    c = Tensor(5.0)
    (a * c).backward()
    assert c.grad is None
