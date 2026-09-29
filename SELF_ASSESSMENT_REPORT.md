# Self-assessment — IA#1
Submitted by: 24120320 — Đỗ Công Hưng
Total I claim: 100 / 100

| Criterion | Max | I claim | Evidence |
|---|---|---|---|
| Behaviour | 30 | 30 | `npm test` green. Worked example `test/cart.test.js:12`; empty cart `:24` + `src/cart.js:20`; inclusive threshold `:33` + `src/cart.js:30`; `RangeError` for negative price and bad `qty` at `src/cart.js:10,13`, tests `:39,45` |
| Tests | 20 | 20 | 7 tests covering the worked example, empty cart, threshold and both `RangeError` cases, plus rounding and `qty: 0`. Mutation sweep confirms each test fails for exactly one mutation |
| Harness | 20 | 20 | `AGENTS.md:3` stack, `:9` commands, `:23` a "never"; `npm run gate` exit 0; CI green on `be91f70` |
| Brief | 15 | 15 | `brief.md:6` files it may touch, `:14` contract, `:16` "zero dependencies", `:32` error cases |
| AI-LOG.md | 15 | 15 | 4 entries, all six fields, naming specific test names, line numbers and mutation counts — checkable against `be91f70` and `e41dd49` |

## What I did not manage
Outside the five scored criteria, and recorded here rather than quietly left
out:

A non-numeric `price` such as `'abc'` passes the negative check and propagates
`NaN` into the total instead of throwing. The brief only requires rejecting
negative prices, so I did not widen the contract, but it is a real hole.

The `price: 0` boundary. The brief is silent on whether a zero price is
valid, so I left it accepted and untested — my mutation sweep still has one
surviving mutant, `price < 0` tightened to `price <= 0`.

## What I would do differently
Run the mutation sweep before calling the tests finished, not after. I only
found the `Math.round` and `qty: 0` gaps when I went looking for weaknesses
in work I had already declared done — both were holes I had left myself.

Not write a brief that contradicts itself. Mine told the assistant not to
touch `package.json` and to run `npm run gate` in the same document, when
that script did not exist, which forced a mid-task override.
