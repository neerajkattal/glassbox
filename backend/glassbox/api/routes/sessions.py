"""REST endpoints for creating, training and inspecting a session."""

from __future__ import annotations

from typing import Annotated

import numpy as np
from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.concurrency import run_in_threadpool

from glassbox.api.schemas import (
    HyperparamsIn,
    PredictIn,
    PredictionOut,
    SessionCreate,
    SessionOut,
    SnapshotOut,
    TrainIn,
    WeightsOut,
)
from glassbox.api.state import get_registry
from glassbox.training.registry import SessionNotFound, SessionRegistry
from glassbox.training.session import TrainingSession

router = APIRouter(prefix="/sessions", tags=["sessions"])
Registry = Annotated[SessionRegistry, Depends(get_registry)]


def _session(session_id: str, registry: Registry) -> TrainingSession:
    try:
        return registry.get(session_id)
    except SessionNotFound:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "session not found") from None


Session = Annotated[TrainingSession, Depends(_session)]


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_session(body: SessionCreate, registry: Registry) -> SessionOut:
    # The first session triggers the dataset download/load, so keep it off the event loop.
    session = await run_in_threadpool(registry.create, seed=body.seed)
    return SessionOut(id=session.id, seed=session.seed, snapshot=session.snapshot().to_dict())


@router.get("/{session_id}")
def get_snapshot(session: Session) -> SnapshotOut:
    return SnapshotOut(**session.snapshot().to_dict())


@router.patch("/{session_id}/hyperparams")
def update_hyperparams(body: HyperparamsIn, session: Session) -> SnapshotOut:
    session.update_hyperparams(learning_rate=body.learning_rate, batch_size=body.batch_size)
    return SnapshotOut(**session.snapshot().to_dict())


@router.post("/{session_id}/train")
async def train(body: TrainIn, session: Session) -> SnapshotOut:
    snapshot = await run_in_threadpool(session.train, body.steps)
    return SnapshotOut(**snapshot.to_dict())


@router.post("/{session_id}/reset")
def reset(session: Session) -> SnapshotOut:
    session.reset()
    return SnapshotOut(**session.snapshot().to_dict())


@router.post("/{session_id}/predict")
def predict(body: PredictIn, session: Session) -> PredictionOut:
    return PredictionOut(**session.predict(np.array(body.pixels)).to_dict())


@router.get("/{session_id}/weights")
def weights(session: Session) -> WeightsOut:
    return WeightsOut(layer=0, neurons=session.first_layer_weights())


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_session(session_id: str, registry: Registry) -> Response:
    registry.delete(session_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
