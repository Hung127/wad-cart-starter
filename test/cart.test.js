import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cartTotal } from '../src/cart.js'

// Every test below is red until cartTotal is implemented. That is the point:
// run `npm test` first and see them fail. A test that has never failed has
// proved nothing.

// Hand-derived: 2 x 180000 = 360000, + 45000 = 405000 subtotal.
// VAT 405000 x 0.08 = 32400. 405000 < 500000, so shipping 30000.
// 405000 + 32400 + 30000 = 467400.
test('the example from the slides', () => {
  const items = [
    { name: 'Áo thun', price: 180000, qty: 2 },
    { name: 'Sổ tay', price: 45000, qty: 1 },
  ]
  const options = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000 }
  assert.equal(cartTotal(items, options), 467400)
})

// A cart with nothing in it is 0. This is the case the general shipping
// rule gets wrong on its own: subtotal 0 is below freeShipFrom, so the
// shipping rule alone would charge 30000 for an empty basket.
test('an empty cart is exactly 0 — no VAT, no shipping', () => {
  const options = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000 }
  assert.equal(cartTotal([], options), 0)
})

// Hand-derived: subtotal 500000, exactly the threshold. Free shipping is
// inclusive, so shipping is 0. vatRate is 0 on purpose, to leave shipping
// as the only thing this test can fail about — a `>` instead of a `>=`
// would give 530000.
test('free shipping is inclusive at exactly freeShipFrom', () => {
  const items = [{ name: 'Sổ tay', price: 500000, qty: 1 }]
  const options = { vatRate: 0, freeShipFrom: 500000, shipFee: 30000 }
  assert.equal(cartTotal(items, options), 500000)
})

test('a negative price throws RangeError', () => {
  const items = [{ name: 'Áo thun', price: -1, qty: 1 }]
  const options = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000 }
  assert.throws(() => cartTotal(items, options), RangeError)
})

test('a non-integer qty throws RangeError', () => {
  const items = [{ name: 'Áo thun', price: 180000, qty: 1.5 }]
  const options = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000 }
  assert.throws(() => cartTotal(items, options), RangeError)
})

// Hand-derived: 333 x 0.08 = 26.64 of VAT, which is not a whole number.
// 333 + 26.64 + 30000 = 30359.64, so the rounded total is 30360. Drop
// the rounding and this returns 30359.64 — a fraction of a đồng.
test('a fractional total is rounded to the whole đồng', () => {
  const items = [{ name: 'Bút bi', price: 333, qty: 1 }]
  const options = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000 }
  assert.equal(cartTotal(items, options), 30360)
})

// qty 0 is a whole integer but not a positive one, so it is rejected.
// The integer check alone would wave it through, contributing 0 to the
// subtotal while still being charged 30000 of shipping.
test('a qty of 0 throws RangeError', () => {
  const items = [{ name: 'Áo thun', price: 180000, qty: 0 }]
  const options = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000 }
  assert.throws(() => cartTotal(items, options), RangeError)
})
