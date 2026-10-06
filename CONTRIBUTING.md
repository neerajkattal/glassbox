# Contributing

Thanks for helping make neural networks less mysterious!

## Local setup

```bash
make setup     # Python venv + npm install
make data      # optional: pre-download MNIST
make dev       # API on :8000, app on :5173
```

## Before opening a pull request

```bash
make lint
make test
```

## Guidelines

- **Beginner first.** New UI text should make sense to someone who has never
  seen a formula. Put numbers behind Tinker mode and formulas behind Math mode.
- **Both languages.** Add every new string to `frontend/src/i18n/en.ts` *and*
  `hinglish.ts`; the type checker and `i18n.test.ts` will catch gaps.
- **Keep the engine readable.** Prefer clarity over cleverness in
  `backend/glassbox/engine`, and add a gradient check for any new operation.
- **Small commits** with messages in the form `area: what changed`.
