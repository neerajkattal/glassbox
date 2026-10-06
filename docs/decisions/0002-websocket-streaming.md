# 2. Stream training over a WebSocket

**Status:** accepted

## Context

Beginners learn by watching the robot improve: the meter falling, bulbs
changing, the curve bending. Polling a REST endpoint would either lag or waste
requests, and the learner also needs to pause, step and "break it" instantly.

## Decision

Each session has a WebSocket at `/api/sessions/{id}/stream`. The client sends
small commands (`play`, `pause`, `step`, `set`, `reset`); while playing, the
server runs `steps_per_tick` gradient steps in a worker thread and pushes a
snapshot every `tick_seconds` (0.1 s by default). REST stays for one-off
actions such as `predict` and `weights`.

## Consequences

- Smooth ~10 fps updates with a single connection.
- Training work runs in `asyncio.to_thread`, so the event loop stays free.
- Sessions are guarded by a lock because predictions (REST) can arrive while
  the stream is training.
- Sessions live in memory: a server restart forgets them. That is acceptable
  for a learning tool; the frontend simply creates a new robot.
