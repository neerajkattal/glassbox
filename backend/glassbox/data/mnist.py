"""MNIST handwritten digits: download once, cache, and parse the IDX format."""

from __future__ import annotations

import gzip
import logging
import struct
import urllib.request
from dataclasses import dataclass
from pathlib import Path

import numpy as np

logger = logging.getLogger(__name__)

MIRRORS = (
    "https://storage.googleapis.com/cvdf-datasets/mnist/",
    "https://ossci-datasets.s3.amazonaws.com/mnist/",
)
FILES = {
    "train_images": "train-images-idx3-ubyte.gz",
    "train_labels": "train-labels-idx1-ubyte.gz",
    "test_images": "t10k-images-idx3-ubyte.gz",
    "test_labels": "t10k-labels-idx1-ubyte.gz",
}


@dataclass(frozen=True)
class Split:
    images: np.ndarray  # (n, 784) float32 in [0, 1]
    labels: np.ndarray  # (n,) int64

    def __len__(self) -> int:
        return len(self.labels)


@dataclass(frozen=True)
class Mnist:
    train: Split
    test: Split


def parse_idx(raw: bytes) -> np.ndarray:
    """Parse an (uncompressed) IDX file into a uint8 array."""
    zero, dtype_code, ndim = struct.unpack(">HBB", raw[:4])
    if zero != 0 or dtype_code != 0x08:
        raise ValueError("not an unsigned-byte IDX file")
    dims = struct.unpack(f">{ndim}I", raw[4 : 4 + 4 * ndim])
    data = np.frombuffer(raw, dtype=np.uint8, offset=4 + 4 * ndim)
    if data.size != int(np.prod(dims)):
        raise ValueError("IDX payload does not match its header")
    return data.reshape(dims)


def _download(name: str, dest: Path) -> None:
    last_error: Exception | None = None
    for mirror in MIRRORS:
        try:
            logger.info("downloading %s from %s", name, mirror)
            with urllib.request.urlopen(mirror + name, timeout=30) as resp:
                dest.write_bytes(resp.read())
            return
        except OSError as exc:  # network errors, HTTP errors
            last_error = exc
    raise RuntimeError(f"could not download {name}: {last_error}")


def _load_file(cache_dir: Path, key: str) -> np.ndarray:
    path = cache_dir / FILES[key]
    if not path.exists():
        cache_dir.mkdir(parents=True, exist_ok=True)
        _download(FILES[key], path)
    return parse_idx(gzip.decompress(path.read_bytes()))


def _split(images: np.ndarray, labels: np.ndarray) -> Split:
    flat = images.reshape(len(images), -1).astype(np.float32) / 255.0
    return Split(images=flat, labels=labels.astype(np.int64))


def load_mnist(cache_dir: Path) -> Mnist:
    """Load MNIST from ``cache_dir``, downloading it the first time."""
    return Mnist(
        train=_split(_load_file(cache_dir, "train_images"), _load_file(cache_dir, "train_labels")),
        test=_split(_load_file(cache_dir, "test_images"), _load_file(cache_dir, "test_labels")),
    )


if __name__ == "__main__":
    import sys

    logging.basicConfig(level=logging.INFO)
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(".data/mnist")
    data = load_mnist(target)
    print(f"MNIST ready in {target}: {len(data.train)} train / {len(data.test)} test digits")
