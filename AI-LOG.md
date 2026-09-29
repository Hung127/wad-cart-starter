# AI-LOG.md

## 2026-09-30 — cartTotal implementation and tests

**Tool:** OpenCode.

**Asked for:**
implement `cartTotal(items, options)` in `src/cart.js` from the IA#1 brief,
with five tests in `test/cart.test.js`, tests written first and watched fail
before any implementation.

**Kept:**
- the three-phase shape it settled on — validate every item, then handle the
  empty cart, then sum and charge.
- Separating validation into its own loop before the summing loop is what
  makes "validate before any arithmetic" true by construction rather than by
  luck of ordering.
- Also kept the `Number.isInteger(qty) || qty <= 0` guard, which covers `0`,
  `1.5`, `-2` and `NaN` in one condition.

**Changed:**
- the free-shipping test. I had it assert a total with `vatRate: 0.08`, which
  meant a VAT bug and a shipping bug would both break the same test.
- I switched it to `vatRate: 0` so shipping is the only variable — a `>`
  written where `>=` belongs now fails that one test and nothing else.
- The expected values in all five tests are hand-derived literals (467400, 0,
  500000), not computed by the code under test.

**Rejected:**
- rounding with `toFixed()`. It returns a string, and the return value is
  checked with `assert.equal` against a number, so it fails the contract even
  though the digits look right. Used `Math.round` instead.
- Also rejected adding a `NaN` check on `price` — the brief only specifies
  negative prices, so `price: NaN` passes through. Not my call to widen the
  contract.

**By hand:**
- the empty-cart early return. The spec is genuinely ambiguous here and it is
  the one place the naive reading is wrong — the general shipping rule says
  `subtotal < freeShipFrom` means charge `shipFee`, and an empty cart has
  `subtotal` 0, so the rule on its own would charge 30000 for a basket with
  nothing in it.
- The spec separately says an empty cart returns exactly 0. I resolved it as
  an explicit override after the validation loop, and left a comment saying
  so, because I expect to be asked about it.

## 2026-09-30 — verification and mutation check

**Tool:** OpenCode.

**Asked for:** run the brief's step 3 (`npm run gate`) and paste the real
output.

**Kept:**
- the mutation check, which I ran for real rather than eyeballing.
- I copied the project to a scratch directory, broke `src/cart.js` eight
  different ways, and recorded which tests noticed.
- It caught three blind spots the five required tests do not pin: removing
  `Math.round`, dropping the `qty <= 0` half of the guard (so `qty: 0` and
  `qty: -2` would be silently accepted), and tightening `price < 0` to
  `price <= 0`.
- I verified the shipped code is correct on all of these by calling it
  directly — `qty` 0, -2, NaN and `price` -1 all throw `RangeError` as
  required.

**Changed:**
- the verification command. `npm run gate` does not exist — `package.json`
  has only a `test` script, so the command the brief and the CI workflow both
  call fails with "Missing script".
- I did not add it, because the brief lists `package.json` as a file I must
  not touch.
- I ran the two checks it describes by hand instead: `node --check` over
  both files, then `node --test`.

**Rejected:**
- adding a `gate` script to `package.json`. It would have made step 3
  literally true, but it is a change to a file I was told not to touch, and
  CI on `main` is already red for this reason on every branch, not just mine.

**By hand:** nothing here — this entry is a record of the check itself.

## 2026-09-30 — closing the coverage gaps

**Tool:** OpenCode.

**Asked for:** add the two extra tests I had offered — a fractional total that
requires `Math.round`, and a `qty` of `0` — once the npm scripts existed.

**Kept:**
- the mutation check as the way to prove the new tests earn their place.
- Both new tests pass instantly against correct code, which proves nothing
  on its own, so I re-ran the sweep against deliberately broken
  implementations instead.
- Each new test fails against exactly the mutation it was written for and
  nothing else: removing `Math.round` fails only the fractional test, and
  dropping the `qty <= 0` half of the guard fails only the `qty: 0` test.

**Changed:**
- my own earlier claim. I said two tests would close all three gaps and that
  was wrong — it is two gaps, not three.
- The third mutation, tightening `price < 0` to `price <= 0`, still
  survives.
- On looking at it properly, the brief is asymmetric: it explicitly lists
  `0`, `1.5`, `-2` and `NaN` as `qty` values that must throw, but says only
  that a *negative* price throws and is silent on a price of `0`.
- So the `qty` guard is spec-mandated and its mutation was a real gap, while
  the `price` mutation is a stricter reading of an underspecified boundary,
  not a defect.
- I left it unpinned rather than write a test that invents a requirement the
  brief never made.

**Rejected:**
- pinning price 0 with a test. It would have made the mutation sweep read
  as 100% when the brief does not actually specify the behaviour, which is
  the sort of green that does not survive being questioned.

**By hand:**
- the npm `lint` and `gate` scripts in `package.json` — I only reported that
  `gate` was missing and was not allowed to edit the file, so adding the
  scripts was my own work.
- One consequence worth knowing: a zero-price item is currently accepted and
  still attracts 30000 of shipping, because the cart is not empty but the
  subtotal is below the free threshold.

## 2026-09-30 — review and commit

**Tool:** OpenCode.

**Asked for:** review the pending changes, re-run `npm run gate`, then stage
the intended files and commit.

**Kept:**
- reviewing the diff before staging. It confirmed the only deletions in
  `test/cart.test.js` were two lines of a stale comment, and that the
  original worked-example test was byte-identical to the starter commit — so
  nothing had been weakened to reach green.
- the `git add -n` dry run, to pin the exact file set before anything entered
  the index.

**Changed:**
- the staged file set, twice, and said so both times. I first proposed four
  files.
- committing `.github/workflows/ci.yml` mattered more than it looked: it is
  the file that runs `npm run gate`, so without it the pipeline stays dead
  however correct the scripts are.

**Rejected:**
- a blind `git add -A`. It would have swept in course scaffolding
  (`AGENTS.md`, `template/`) with nothing to do with the task.
- pushing. `main` is the default branch and I was asked to commit only.

**By hand:**
- the scope decisions — which files belonged in the commit, whether the CI
  workflow went in, and stopping short of the push.
