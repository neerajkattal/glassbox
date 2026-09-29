import numpy as np

from glassbox.training.session import TrainingSession


def test_training_improves_accuracy(tiny_mnist):
    session = TrainingSession(tiny_mnist, seed=1, eval_size=200)
    before = session.snapshot().accuracy
    after = session.train(300)
    assert after.step == 300
    assert after.samples_seen == 300 * 32
    assert after.accuracy > max(0.9, before)
    assert not after.exploded


def test_huge_learning_rate_explodes_and_stops(tiny_mnist):
    session = TrainingSession(tiny_mnist, seed=1, eval_size=200)
    session.update_hyperparams(learning_rate=200.0)
    snap = session.train(400)
    assert snap.exploded
    assert snap.step < 400


def test_reset_restores_the_same_starting_brain(tiny_mnist):
    session = TrainingSession(tiny_mnist, seed=5, eval_size=200)
    start = session.model.layers[0].weight.data.copy()
    session.train(50)
    session.reset()
    np.testing.assert_array_equal(session.model.layers[0].weight.data, start)
    assert session.snapshot().step == 0


def test_predict_reports_probabilities_and_bulbs(tiny_mnist):
    session = TrainingSession(tiny_mnist, seed=2, eval_size=200)
    result = session.predict(tiny_mnist.test.images[0])
    assert len(result.probabilities) == 10
    assert abs(sum(result.probabilities) - 1.0) < 1e-3
    assert [len(layer) for layer in result.activations] == [16, 16]
    assert all(0.0 <= a <= 1.0 for layer in result.activations for a in layer)


def test_first_layer_weights_shape(tiny_mnist):
    weights = TrainingSession(tiny_mnist, seed=2).first_layer_weights()
    assert len(weights) == 16 and len(weights[0]) == 784
