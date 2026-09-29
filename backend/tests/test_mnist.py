import gzip
import struct

import numpy as np
import pytest

from glassbox.data import mnist


def idx_bytes(array: np.ndarray) -> bytes:
    header = struct.pack(">HBB", 0, 0x08, array.ndim)
    header += struct.pack(f">{array.ndim}I", *array.shape)
    return header + array.astype(np.uint8).tobytes()


def test_parse_idx_round_trip():
    images = np.arange(2 * 3 * 3, dtype=np.uint8).reshape(2, 3, 3)
    np.testing.assert_array_equal(mnist.parse_idx(idx_bytes(images)), images)


def test_parse_idx_rejects_truncated_payload():
    with pytest.raises(ValueError):
        mnist.parse_idx(idx_bytes(np.zeros((2, 2), dtype=np.uint8))[:-1])


def test_load_mnist_reads_cached_files_and_normalises(tmp_path):
    images = np.full((3, 28, 28), 255, dtype=np.uint8)
    labels = np.array([7, 1, 4], dtype=np.uint8)
    for key, array in {
        "train_images": images,
        "train_labels": labels,
        "test_images": images[:1],
        "test_labels": labels[:1],
    }.items():
        (tmp_path / mnist.FILES[key]).write_bytes(gzip.compress(idx_bytes(array)))

    data = mnist.load_mnist(tmp_path)

    assert data.train.images.shape == (3, 784)
    assert data.train.images.max() == pytest.approx(1.0)
    assert data.train.labels.tolist() == [7, 1, 4]
    assert len(data.test) == 1
