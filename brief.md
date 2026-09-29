# Brief — implement `cartTotal` (CSC13008, IA#1)

Hand this brief to an assistant. It is self-contained: no README, no slides,
no conversation history needed.

## Files you may touch
- `src/cart.js` — the implementation
- `test/cart.test.js` — the tests

## Files you must not touch
`package.json`, `.github/`, `AGENTS.md`, `README.md`, `template/`, `.gitignore`.
If you think one of them needs to change, stop and say so. Do not add files.

## The contract
Implement `cartTotal(items, options)` in `src/cart.js`. Plain JavaScript, ESM,
zero dependencies — not even a devDependency.

    cartTotal(items, options) -> number

- `items`: `[{ name, price, qty }]`
- `options`: `{ vatRate, freeShipFrom, shipFee }`

- `subtotal` = sum of `price × qty`
- VAT = `subtotal × vatRate`
- shipping = `0` when `subtotal >= freeShipFrom` (inclusive), else `shipFee`
- return `subtotal + VAT + shipping` — a **number**, rounded to the whole đồng
- an empty cart returns exactly `0`: no VAT, no shipping

Do not use `toFixed()`; it returns a string and the return value is checked
with `assert.equal` against a number.

## Error cases
Throw `RangeError` when:
- any `price` is negative
- any `qty` is not a positive integer — `0`, `1.5`, `-2`, `NaN` all throw

Validate every item before any arithmetic, so a bad item is rejected even if
an earlier one was already summed.

## Tests to write
One test per case, each able to fail for exactly one reason:
1. the worked example — 2 × 180000 + 1 × 45000 → 467400
2. the empty cart → 0
3. free shipping at exactly `subtotal === freeShipFrom` → shipping is 0
4. a negative price → RangeError
5. a non-integer `qty` → RangeError

## Order of work
1. Write the five tests first. Run `npm test` and watch them fail — a test
   that has never failed has proved nothing.
2. Then implement `cartTotal` until they pass.
3. Re-run `npm run gate` and paste the real output.

`npm run gate` runs `node --check` over both files, then `node --test`.
It must exit 0.
