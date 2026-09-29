import numpy as np
import pytest

from glassbox.data.mnist import Mnist, Split


@pytest.fixture
def tiny_mnist() -> Mnist:
    """A learnable stand-in for MNIST: each class lights up its own pixel block."""
    rng = np.random.default_rng(0)

    def make(n: int) -> Split:
        labels = rng.integers(0, 10, size=n)
        images = rng.uniform(0, 0.1, size=(n, 784)).astype(np.float32)
        for i, label in enumerate(labels):
            images[i, label * 78 : label * 78 + 78] = 1.0
        return Split(images=images, labels=labels)

    return Mnist(train=make(600), test=make(200))
