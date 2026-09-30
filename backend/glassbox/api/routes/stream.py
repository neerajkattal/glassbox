"""Live training over a WebSocket.

The client sends small commands and the server pushes a snapshot after every
"tick" of training, so the browser can animate the robot learning.

Client → server::

    {"action": "play", "steps_per_tick": 5}
    {"action": "pause"}
    {"action": "step"}                       # exactly one gradient step
    {"action": "set", "learning_rate": 1.0, "batch_size": 32, "steps_per_tick": 5}
    {"action": "reset"}

Server → client::

    {"type": "snapshot", "running": true, "snapshot": {...}}
    {"type": "error", "message": "..."}
"""

from __future__ import annotations

import asyncio
import contextlib

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field, ValidationError

from glassbox.training.registry import SessionNotFound
from glassbox.training.session import TrainingSession

router = APIRouter(tags=["stream"])

MAX_STEPS_PER_TICK = 200


class Command(BaseModel):
    action: str = Field(pattern="^(play|pause|step|set|reset)$")
    steps_per_tick: int | None = Field(default=None, ge=1, le=MAX_STEPS_PER_TICK)
    learning_rate: float | None = Field(default=None, gt=0, le=100)
    batch_size: int | None = Field(default=None, ge=1, le=256)


class StreamState:
    def __init__(self) -> None:
        self.running = False
        self.steps_per_tick = 5


async def _send(ws: WebSocket, session: TrainingSession, state: StreamState) -> None:
    await ws.send_json(
        {"type": "snapshot", "running": state.running, "snapshot": session.snapshot().to_dict()}
    )


async def _apply(cmd: Command, ws: WebSocket, session: TrainingSession, state: StreamState) -> None:
    if cmd.steps_per_tick is not None:
        state.steps_per_tick = cmd.steps_per_tick
    if cmd.learning_rate is not None or cmd.batch_size is not None:
        session.update_hyperparams(learning_rate=cmd.learning_rate, batch_size=cmd.batch_size)

    if cmd.action == "play":
        state.running = not session.exploded
    elif cmd.action == "pause":
        state.running = False
    elif cmd.action == "step":
        state.running = False
        await asyncio.to_thread(session.train, 1)
    elif cmd.action == "reset":
        state.running = False
        session.reset()
    await _send(ws, session, state)


@router.websocket("/sessions/{session_id}/stream")
async def stream(ws: WebSocket, session_id: str) -> None:
    await ws.accept()
    try:
        session = ws.app.state.registry.get(session_id)
    except SessionNotFound:
        await ws.send_json({"type": "error", "message": "session not found"})
        await ws.close(code=4404)
        return

    tick = ws.app.state.settings.tick_seconds
    state = StreamState()
    await _send(ws, session, state)

    with contextlib.suppress(WebSocketDisconnect):
        while True:
            try:
                raw = await asyncio.wait_for(ws.receive_json(), tick if state.running else None)
            except TimeoutError:
                raw = None

            if raw is not None:
                try:
                    await _apply(Command.model_validate(raw), ws, session, state)
                except ValidationError as exc:
                    await ws.send_json({"type": "error", "message": exc.errors()[0]["msg"]})
                continue

            if state.running:
                await asyncio.to_thread(session.train, state.steps_per_tick)
                if session.exploded:
                    state.running = False
                await _send(ws, session, state)
