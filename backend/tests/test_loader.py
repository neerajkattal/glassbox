import numpy as np

from glassbox.data.loader import BatchSampler
from glassbox.data.mnist import Split


def make_split(n=10):
    return Split(images=np.arange(n * 4, dtype=np.float32).reshape(n, 4), labels=np.arange(n))


def test_batches_have_requested_size_and_matching_labels():
    sampler = BatchSampler(make_split(), np.random.default_rng(0))
    images, labels = sampler.next(4)
    assert images.shape == (4, 4)
    np.testing.assert_array_equal(images[:, 0] / 4, labels)


def test_one_epoch_visits_every_example_once():
    sampler = BatchSampler(make_split(10), np.random.default_rng(1))
    seen = np.concatenate([sampler.next(5)[1] for _ in range(2)])
    assert sorted(seen.tolist()) == list(range(10))
    assert sampler.epoch == 0
    sampler.next(5)
    assert sampler.epoch == 1
