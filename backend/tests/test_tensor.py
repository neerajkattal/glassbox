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


def test_matmul_gradients_match_closed_form():
    rng = np.random.default_rng(0)
    x = Tensor(rng.normal(size=(4, 3)), requires_grad=True)
    w = Tensor(rng.normal(size=(3, 2)), requires_grad=True)
    (x @ w).sum().backward()
    np.testing.assert_allclose(x.grad, np.ones((4, 2)) @ w.data.T)
    np.testing.assert_allclose(w.grad, x.data.T @ np.ones((4, 2)))


def test_mean_over_axis():
    t = Tensor(np.arange(6.0).reshape(2, 3), requires_grad=True)
    out = t.mean(axis=0)
    np.testing.assert_allclose(out.data, [1.5, 2.5, 3.5])
    out.sum().backward()
    np.testing.assert_allclose(t.grad, np.full((2, 3), 0.5))


def test_relu_blocks_negative_gradients():
    t = Tensor([-1.0, 0.5, 2.0], requires_grad=True)
    t.relu().sum().backward()
    np.testing.assert_allclose(t.grad, [0.0, 1.0, 1.0])


def test_sigmoid_value_and_gradient_at_zero():
    t = Tensor(0.0, requires_grad=True)
    out = t.sigmoid()
    out.backward()
    assert out.item() == pytest.approx(0.5)
    assert t.grad == pytest.approx(0.25)


def test_division_and_power():
    a = Tensor(4.0, requires_grad=True)
    out = 1.0 / a + a**2
    out.backward()
    assert out.item() == pytest.approx(16.25)
    assert a.grad == pytest.approx(-1 / 16 + 8)
