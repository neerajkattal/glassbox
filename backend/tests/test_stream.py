import pytest
from fastapi.testclient import TestClient
from starlette.websockets import WebSocketDisconnect

from glassbox.api.config import Settings
from glassbox.api.main import create_app


@pytest.fixture
def client(tiny_mnist):
    app = create_app(Settings(tick_seconds=0.001), data_loader=lambda: tiny_mnist)
    with TestClient(app) as c:
        yield c


def open_stream(client):
    sid = client.post("/api/sessions", json={"seed": 1}).json()["id"]
    return client.websocket_connect(f"/api/sessions/{sid}/stream")


def test_stream_sends_initial_snapshot(client):
    with open_stream(client) as ws:
        msg = ws.receive_json()
        assert msg["type"] == "snapshot"
        assert msg["running"] is False
        assert msg["snapshot"]["step"] == 0


def test_step_runs_exactly_one_update(client):
    with open_stream(client) as ws:
        ws.receive_json()
        ws.send_json({"action": "step"})
        assert ws.receive_json()["snapshot"]["step"] == 1


def test_play_streams_progress_until_paused(client):
    with open_stream(client) as ws:
        ws.receive_json()
        ws.send_json({"action": "play", "steps_per_tick": 10})
        assert ws.receive_json()["running"] is True
        steps = [ws.receive_json()["snapshot"]["step"] for _ in range(3)]
        assert steps == sorted(steps) and steps[-1] >= 30
        ws.send_json({"action": "pause"})
        # Drain until the pause is acknowledged.
        while ws.receive_json()["running"]:
            pass


def test_break_it_stops_streaming_when_training_explodes(client):
    with open_stream(client) as ws:
        ws.receive_json()
        ws.send_json({"action": "play", "learning_rate": 100, "steps_per_tick": 50})
        for _ in range(50):
            msg = ws.receive_json()
            if msg["snapshot"]["exploded"]:
                break
        assert msg["snapshot"]["exploded"] and msg["running"] is False
        ws.send_json({"action": "reset", "learning_rate": 1.0})
        msg = ws.receive_json()
        assert msg["snapshot"]["step"] == 0 and not msg["snapshot"]["exploded"]


def test_invalid_command_reports_error(client):
    with open_stream(client) as ws:
        ws.receive_json()
        ws.send_json({"action": "dance"})
        assert ws.receive_json()["type"] == "error"


def test_unknown_session_closes(client):
    with client.websocket_connect("/api/sessions/nope/stream") as ws:
        assert ws.receive_json()["type"] == "error"
        with pytest.raises(WebSocketDisconnect):
            ws.receive_json()
