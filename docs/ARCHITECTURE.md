# Architecture

Glassbox is a small, two-part application: a Python backend that owns the
neural network, and a React frontend that turns it into a guided game.

```
┌──────────────────────────── Browser ────────────────────────────┐
│  React + TypeScript + Tailwind                                   │
│                                                                  │
│  DrawPad ──preprocess──▶ 784 pixels ──POST /predict──┐           │
│  TrainControls ──WS commands (play/pause/step/set)──┐ │           │
│  Mission state machine ◀── snapshots ◀──────────────┤ │           │
│  BrainView / WrongMeter / LossChart ◀── predictions ◀─┘           │
└──────────────────────────────┬───────────────────────────────────┘
                               │ Vite dev proxy (/api, WebSocket)
┌──────────────────────────────▼───────────── FastAPI ─────────────┐
│  routes/sessions.py   REST: create, predict, weights, reset      │
│  routes/stream.py     WebSocket: live training loop              │
│  state.py             lazy MNIST loading + SessionRegistry       │
│                                                                  │
│  training/session.py  one learner's network, sampler, snapshots  │
│  training/model.py    784 → 16 → 16 → 10, sigmoid hidden layers  │
│  data/mnist.py        download, cache and parse IDX files        │
│                                                                  │
│  engine/              NumPy autograd: Tensor, nn, optim, losses  │
└──────────────────────────────────────────────────────────────────┘
```

## Backend

### Engine (`backend/glassbox/engine`)

| Module | Responsibility |
|---|---|
| `tensor.py` | `Tensor` with reverse-mode autograd. Each op stores its parents and a `_backward` closure; `backward()` topologically sorts the graph and applies the chain rule. Broadcasting is undone with `_unbroadcast`. |
| `functional.py` | Numerically stable `log_softmax` with a fused backward, `cross_entropy`, `softmax` and `accuracy`. |
| `nn.py` | `Module`, `Linear` (He init), `ReLU`, `Sigmoid`, `Sequential` with `trace()` to capture every layer's output for the brain view. |
| `optim.py` | `SGD` (with momentum) and `Adam`. |
| `gradcheck.py` | Central finite differences; the tests use it to prove backprop is correct to ~1e-6. |

### Training sessions (`backend/glassbox/training`)

A `TrainingSession` owns one network, its optimizer and a shuffled
`BatchSampler`. `train(n)` runs `n` SGD steps, keeps an exponentially smoothed
loss and evaluates accuracy on a fixed 1,000-digit test subset. If the smoothed
loss exceeds 5 (far worse than random guessing at ln 10 ≈ 2.3) or becomes
non-finite, the session marks itself **exploded** and refuses to train until
reset — this powers the "Break it!" lesson.

Sessions are kept in an in-memory `SessionRegistry` with idle expiry and a cap
on concurrent sessions, and each session is guarded by a re-entrant lock.

### API (`backend/glassbox/api`)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/health` | Liveness and version |
| `POST` | `/api/sessions` | Create a robot (optional `seed`) |
| `GET` | `/api/sessions/{id}` | Current snapshot |
| `PATCH` | `/api/sessions/{id}/hyperparams` | Learning rate and batch size |
| `POST` | `/api/sessions/{id}/train` | Run N steps synchronously |
| `POST` | `/api/sessions/{id}/reset` | Fresh random weights |
| `POST` | `/api/sessions/{id}/predict` | 784 pixels → probabilities + hidden activations |
| `GET` | `/api/sessions/{id}/weights` | First-layer weights (16 × 784) |
| `DELETE` | `/api/sessions/{id}` | Forget a session |
| `WS` | `/api/sessions/{id}/stream` | Live training (see ADR 0002) |

Interactive docs are served at `/docs` while the API is running.

## Frontend

| Area | Files |
|---|---|
| Pages | `pages/HomePage.tsx` (hero, how-it-works, learning map), `pages/DigitIsland.tsx` (the mission) |
| Mission logic | `missions/digitIsland.ts` — a pure state machine: `advance(step, event)` returns the next step and any concept to reveal |
| Live data | `hooks/useSession.ts`, `hooks/useTraining.ts` (WebSocket + history), `lib/trainingSocket.ts` |
| Drawing | `components/draw/DrawPad.tsx`, `lib/preprocess.ts` (crop, scale to 20 px, centre by mass in 28×28 — the MNIST recipe) |
| Visuals | `BrainView` (SVG bulbs), `NeuronDetail` (weight heatmap), `WrongMeter`, `LossChart`, `AnswerBars` |
| Teaching | `GuidePanel` + `Robot` (Bit), `ConceptCard` (+ `concepts/math.ts` for Math mode), `WhatHappened` feed |
| Settings | `state/depth.tsx` (Story/Tinker/Math), `i18n/` (English + Hinglish, type-checked parity) |

### Mission flow

```
meet ──guess──▶ train ──80% accuracy──▶ retry ──guess──▶ peek
  ──open a bulb──▶ break ──explode──▶ fix ──reset──▶ final ──90%──▶ done
```

Concept cards unlock along the way: *Training & loss*, *Neurons*, *Weights*,
*Learning rate* and *Gradient descent*.

## Testing

- **Backend (pytest):** autograd ops, gradient checks, layers, optimizers
  (including divergence), MNIST parsing with synthetic IDX files, sessions,
  registry, REST and WebSocket flows using a tiny learnable stand-in dataset.
- **Frontend (vitest):** drawing preprocessing, translation parity, mission
  state machine, meter levels.
- **CI:** `.github/workflows/ci.yml` runs lint, type-check, tests and a
  production build on every push.
