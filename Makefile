.PHONY: setup data api web dev test lint build clean

PY := backend/.venv/bin/python

setup: ## Create the Python venv and install all dependencies
	python3 -m venv backend/.venv
	$(PY) -m pip install --upgrade pip
	$(PY) -m pip install -r backend/requirements-dev.txt
	cd frontend && npm install

data: ## Download MNIST (about 11 MB) ahead of time
	cd backend && .venv/bin/python -m glassbox.data.mnist .data/mnist

api: ## Run the API on http://127.0.0.1:8000
	cd backend && .venv/bin/uvicorn glassbox.api.main:app --reload --port 8000

web: ## Run the frontend on http://localhost:5173
	cd frontend && npm run dev

dev: ## Run API and frontend together
	./scripts/dev.sh

test: ## Run all backend and frontend tests
	cd backend && .venv/bin/python -m pytest
	cd frontend && npm test

lint: ## Lint and type-check everything
	cd backend && .venv/bin/ruff check . && .venv/bin/ruff format --check .
	cd frontend && npm run typecheck

build: ## Production build of the frontend
	cd frontend && npm run build

clean:
	rm -rf backend/.venv backend/.pytest_cache frontend/node_modules frontend/dist
