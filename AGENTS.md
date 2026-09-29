# Project rules

Stack: Node 22, ESM (`"type": "module"`). Tests are `node:test` plus
`node:assert/strict`. Zero dependencies — do not add a package, not even a
devDependency, without asking.

Style: 2-space indent, single quotes, no semicolons, named exports only.

Commands: `npm test` · `npm run lint` · `npm run gate`

Domain: amounts are whole đồng. `cartTotal` returns a **number**, never a
formatted string — `toFixed()` returns a string, so round with `Math.round`.
Free shipping is inclusive: `subtotal >= freeShipFrom` ships free. An empty
cart is exactly `0`, with no VAT and no shipping.

Validation: a negative `price`, or a `qty` that is not a positive integer,
throws `RangeError` — check before any arithmetic runs.

Tests: one test per rubric behaviour (the worked example 467400, the empty
cart, the free-shipping threshold, both `RangeError` cases). Assert the
specification, not the implementation. One failure reason per test.

Never: weaken, skip or delete a failing test to get `npm test` green; round
the total through a string; commit `node_modules/` or `.env`.

After any change: run `npm run gate`, then add an `AI-LOG.md` entry for the
task while it is still in your head. you must follow template in `./template/AI-LOG-TEMPLATE.md`

When a failure or wrong decision reveals a reusable lesson, record the incident in `AI-LOG.md`
and, when the lesson is broadly applicable and validated, promote it to these project rules.
