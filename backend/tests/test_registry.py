import pytest

from glassbox.training.registry import SessionNotFound, SessionRegistry
from glassbox.training.session import TrainingSession


@pytest.fixture
def registry(tiny_mnist):
    return SessionRegistry(lambda: TrainingSession(tiny_mnist, seed=0, eval_size=50), max_sessions=2)


def test_create_and_get(registry):
    session = registry.create()
    assert registry.get(session.id) is session


def test_unknown_session_raises(registry):
    with pytest.raises(SessionNotFound):
        registry.get("missing")


def test_cap_evicts_least_recently_used(registry):
    first, second = registry.create(), registry.create()
    registry.get(first.id)  # first is now the most recently used
    registry.create()
    assert len(registry) == 2
    with pytest.raises(SessionNotFound):
        registry.get(second.id)


def test_idle_sessions_expire(registry):
    registry.idle_seconds = -1
    old = registry.create()
    registry.create()
    with pytest.raises(SessionNotFound):
        registry.get(old.id)
