import numpy as np

from glassbox.engine import Tensor
from glassbox.engine.functional import cross_entropy
from glassbox.engine.gradcheck import check_gradients


def test_two_layer_network_gradients_match_finite_differences():
    rng = np.random.default_rng(42)
    x = Tensor(rng.normal(size=(5, 4)))
    w1 = Tensor(rng.normal(size=(4, 6)) * 0.5, requires_grad=True)
    b1 = Tensor(rng.normal(size=6) * 0.1, requires_grad=True)
    w2 = Tensor(rng.normal(size=(6, 3)) * 0.5, requires_grad=True)
    targets = np.array([0, 2, 1, 1, 0])

    def loss():
        hidden = (x @ w1 + b1).sigmoid()
        return cross_entropy(hidden @ w2, targets)

    assert check_gradients(loss, [w1, b1, w2]) < 1e-6


def test_elementwise_ops_pass_gradient_check():
    rng = np.random.default_rng(7)
    a = Tensor(rng.uniform(0.5, 2.0, size=(3, 3)), requires_grad=True)

    def loss():
        return ((a.exp() + a.log()) * a.tanh() / (a**2 + 1.0)).mean()

    assert check_gradients(loss, [a]) < 1e-6
