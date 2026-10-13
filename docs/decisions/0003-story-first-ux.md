# 3. Story first, names second, maths last

**Status:** accepted

## Context

Most learning material about neural networks starts with notation and loses
beginners in minutes. Glassbox should work for someone who has never seen a
formula, without boring someone preparing for an interview.

## Decision

- **Play → notice → name.** Every concept card ("You just discovered…")
  appears *after* the learner has experienced the idea in the mission.
- **One screen, three depths.** Story (no numbers), Tinker (sliders, real
  values, learning curve) and Math (formulas plus the engine code) change how
  much detail is shown, not what is shown.
- **Everyday words.** Neurons are bulbs, weights are knobs, the loss is the
  "how wrong" meter, and a too-high learning rate is "Break it!".
- **English by default, Hinglish one tap away.** Translations are typed so a
  missing string fails the build.

## Consequences

- Copy matters as much as code; every new screen needs both languages.
- Missions are pure state machines (`frontend/src/missions`) so the teaching
  flow is unit-tested independently of the UI.
