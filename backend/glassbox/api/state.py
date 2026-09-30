"""Process-wide state: the dataset (loaded once, lazily) and the session registry."""

from __future__ import annotations

import threading
from collections.abc import Callable

from fastapi import Request

from glassbox.data.mnist import Mnist
from glassbox.training.registry import SessionRegistry
from glassbox.training.session import TrainingSession


class LazyDataset:
    """Loads the dataset on first use so the server starts instantly."""

    def __init__(self, loader: Callable[[], Mnist]) -> None:
        self._loader = loader
        self._data: Mnist | None = None
        self._lock = threading.Lock()

    def get(self) -> Mnist:
        with self._lock:
            if self._data is None:
                self._data = self._loader()
            return self._data


def build_registry(dataset: LazyDataset, max_sessions: int, idle_seconds: float) -> SessionRegistry:
    return SessionRegistry(
        factory=lambda: TrainingSession(dataset.get()),
        max_sessions=max_sessions,
        idle_seconds=idle_seconds,
    )


def get_registry(request: Request) -> SessionRegistry:
    return request.app.state.registry
