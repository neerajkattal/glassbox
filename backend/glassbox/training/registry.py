"""In-memory store of live sessions, with idle expiry and a hard cap."""

from __future__ import annotations

import threading
import time
from collections.abc import Callable

from glassbox.training.session import TrainingSession


class SessionNotFound(KeyError):
    pass


class SessionRegistry:
    def __init__(
        self,
        factory: Callable[[], TrainingSession],
        max_sessions: int = 50,
        idle_seconds: float = 30 * 60,
    ) -> None:
        self._factory = factory
        self._sessions: dict[str, TrainingSession] = {}
        self._lock = threading.Lock()
        self.max_sessions = max_sessions
        self.idle_seconds = idle_seconds

    def create(self) -> TrainingSession:
        session = self._factory()
        with self._lock:
            self._expire_idle()
            if len(self._sessions) >= self.max_sessions:
                oldest = min(self._sessions.values(), key=lambda s: s.last_used)
                del self._sessions[oldest.id]
            self._sessions[session.id] = session
        return session

    def get(self, session_id: str) -> TrainingSession:
        with self._lock:
            session = self._sessions.get(session_id)
        if session is None:
            raise SessionNotFound(session_id)
        session.touch()
        return session

    def delete(self, session_id: str) -> None:
        with self._lock:
            self._sessions.pop(session_id, None)

    def __len__(self) -> int:
        return len(self._sessions)

    def _expire_idle(self) -> None:
        cutoff = time.monotonic() - self.idle_seconds
        for sid in [sid for sid, s in self._sessions.items() if s.last_used < cutoff]:
            del self._sessions[sid]
