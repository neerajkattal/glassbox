import numpy as np
import pytest
from fastapi.testclient import TestClient

from glassbox.api.config import Settings
from glassbox.api.main import create_app


@pytest.fixture
def client(tiny_mnist):
    app = create_app(Settings(tick_seconds=0.01), data_loader=lambda: tiny_mnist)
    with TestClient(app) as c:
        yield c


@pytest.fixture
def session_id(client):
    return client.post("/api/sessions", json={"seed": 3}).json()["id"]


def test_health(client):
    assert client.get("/api/health").json()["status"] == "ok"


def test_create_session_returns_fresh_snapshot(client):
    res = client.post("/api/sessions", json={"seed": 3})
    assert res.status_code == 201
    body = res.json()
    assert body["seed"] == 3
    assert body["snapshot"]["step"] == 0


def test_train_then_predict(client, session_id, tiny_mnist):
    snap = client.post(f"/api/sessions/{session_id}/train", json={"steps": 200}).json()
    assert snap["step"] == 200 and snap["accuracy"] > 0.9
    pixels = tiny_mnist.test.images[0].tolist()
    pred = client.post(f"/api/sessions/{session_id}/predict", json={"pixels": pixels}).json()
    assert pred["prediction"] == int(tiny_mnist.test.labels[0])


def test_predict_rejects_wrong_size(client, session_id):
    res = client.post(f"/api/sessions/{session_id}/predict", json={"pixels": [0.0] * 10})
    assert res.status_code == 422


def test_hyperparams_are_validated_and_applied(client, session_id):
    url = f"/api/sessions/{session_id}/hyperparams"
    assert client.patch(url, json={"learning_rate": -1}).status_code == 422
    snap = client.patch(url, json={"learning_rate": 0.5, "batch_size": 64}).json()
    assert snap["learning_rate"] == 0.5 and snap["batch_size"] == 64


def test_reset_and_weights(client, session_id):
    client.post(f"/api/sessions/{session_id}/train", json={"steps": 10})
    assert client.post(f"/api/sessions/{session_id}/reset").json()["step"] == 0
    weights = client.get(f"/api/sessions/{session_id}/weights").json()
    assert np.array(weights["neurons"]).shape == (16, 784)


def test_unknown_and_deleted_sessions_are_404(client, session_id):
    assert client.get("/api/sessions/nope").status_code == 404
    assert client.delete(f"/api/sessions/{session_id}").status_code == 204
    assert client.get(f"/api/sessions/{session_id}").status_code == 404
