import numpy as np
import pytest

from glassbox.engine import Tensor
from glassbox.engine.functional import accuracy, cross_entropy, log_softmax, softmax


def test_softmax_rows_sum_to_one_and_survive_large_values():
    probs = softmax(np.array([[1000.0, 1000.0], [0.0, np.log(3.0)]]))
    np.testing.assert_allclose(probs.sum(axis=1), [1.0, 1.0])
    np.testing.assert_allclose(probs[1], [0.25, 0.75])


def test_log_softmax_matches_log_of_softmax():
    x = np.random.default_rng(1).normal(size=(3, 5))
    np.testing.assert_allclose(log_softmax(Tensor(x)).data, np.log(softmax(x)))


def test_cross_entropy_of_uniform_logits_is_log_classes():
    loss = cross_entropy(Tensor(np.zeros((4, 10))), np.array([0, 1, 2, 3]))
    assert loss.item() == pytest.approx(np.log(10))


def test_cross_entropy_gradient_is_probs_minus_one_hot():
    x = np.random.default_rng(2).normal(size=(2, 3))
    logits = Tensor(x, requires_grad=True)
    targets = np.array([2, 0])
    cross_entropy(logits, targets).backward()
    expected = softmax(x)
    expected[np.arange(2), targets] -= 1.0
    np.testing.assert_allclose(logits.grad, expected / 2)


def test_accuracy():
    logits = np.array([[0.1, 0.9], [0.8, 0.2], [0.3, 0.7]])
    assert accuracy(logits, np.array([1, 0, 0])) == pytest.approx(2 / 3)
