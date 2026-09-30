"""Application factory. Run with: uvicorn glassbox.api.main:app --reload"""

from __future__ import annotations

from collections.abc import Callable

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from glassbox import __version__
from glassbox.api.config import Settings, get_settings
from glassbox.api.routes import health, sessions
from glassbox.api.state import LazyDataset, build_registry
from glassbox.data.mnist import Mnist, load_mnist


def create_app(
    settings: Settings | None = None, data_loader: Callable[[], Mnist] | None = None
) -> FastAPI:
    settings = settings or get_settings()
    app = FastAPI(
        title="Glassbox API",
        version=__version__,
        description="Train and inspect a see-through neural network.",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    dataset = LazyDataset(data_loader or (lambda: load_mnist(settings.data_dir)))
    app.state.settings = settings
    app.state.registry = build_registry(
        dataset, settings.max_sessions, settings.session_idle_seconds
    )

    app.include_router(health.router, prefix="/api")
    app.include_router(sessions.router, prefix="/api")
    return app


app = create_app()
