#!/usr/bin/env bash
# Start the API and the frontend together; Ctrl+C stops both.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -x backend/.venv/bin/uvicorn ] || [ ! -d frontend/node_modules ]; then
  echo "Dependencies missing — run 'make setup' first." >&2
  exit 1
fi

trap 'kill 0' EXIT INT TERM
(cd backend && .venv/bin/uvicorn glassbox.api.main:app --reload --port 8000) &
(cd frontend && npm run dev) &

echo ""
echo "  Glassbox is starting:"
echo "    App  → http://localhost:5173"
echo "    API  → http://127.0.0.1:8000/docs"
echo ""
wait
