# 1. Write the neural network engine from scratch in NumPy

**Status:** accepted

## Context

Glassbox exists to make neural networks understandable. Every number the
learner sees — a bulb's brightness, a knob's value, the loss — should be
traceable to code they can read. PyTorch or TensorFlow would train faster but
hide the interesting parts behind `loss.backward()` and compiled kernels.

## Decision

Implement a small reverse-mode autograd engine (`backend/glassbox/engine`) on
plain NumPy: a `Tensor` that records its parents and a backward closure, a few
layers, cross-entropy and two optimizers. Correctness is enforced with
finite-difference gradient checks in the test suite.

## Consequences

- The whole engine is a few hundred lines and fits in a learner's head.
- The Math mode can show the exact line of code behind each concept.
- It is slower than a real framework. The Digit Island network
  (784-16-16-10) trains at about 0.15 ms per step on a laptop, which is more
  than fast enough. Future islands (a tiny transformer) may need batching
  care but should stay within reach.
