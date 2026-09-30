"""Request and response models: the contract with the frontend."""

from __future__ import annotations

from pydantic import BaseModel, Field, field_validator

from glassbox.training.model import INPUT_SIZE


class SnapshotOut(BaseModel):
    step: int
    samples_seen: int
    epoch: int
    loss: float | None
    accuracy: float
    learning_rate: float
    batch_size: int
    exploded: bool


class SessionCreate(BaseModel):
    seed: int | None = Field(default=None, ge=0, le=2**31 - 1)


class SessionOut(BaseModel):
    id: str
    seed: int
    snapshot: SnapshotOut


class HyperparamsIn(BaseModel):
    learning_rate: float | None = Field(default=None, gt=0, le=100)
    batch_size: int | None = Field(default=None, ge=1, le=256)


class TrainIn(BaseModel):
    steps: int = Field(default=100, ge=1, le=5000)


class PredictIn(BaseModel):
    pixels: list[float]

    @field_validator("pixels")
    @classmethod
    def check_pixels(cls, pixels: list[float]) -> list[float]:
        if len(pixels) != INPUT_SIZE:
            raise ValueError(f"expected {INPUT_SIZE} pixels (a 28x28 image)")
        if any(p < 0 or p > 1 for p in pixels):
            raise ValueError("pixels must be between 0 and 1")
        return pixels


class PredictionOut(BaseModel):
    prediction: int
    probabilities: list[float]
    activations: list[list[float]]


class WeightsOut(BaseModel):
    layer: int
    neurons: list[list[float]]
