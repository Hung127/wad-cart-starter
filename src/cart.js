// Total cost of a cart, in whole đồng.
// items: [{ name, price, qty }] · options: { vatRate, freeShipFrom, shipFee }
export function cartTotal(items, options) {
  const { vatRate, freeShipFrom, shipFee } = options

  // Validate every item before any arithmetic runs, so a bad item is
  // rejected on its own merits and never half-summed into a subtotal.
  for (const item of items) {
    if (item.price < 0) {
      throw new RangeError(`price must not be negative: ${item.price}`)
    }
    if (!Number.isInteger(item.qty) || item.qty <= 0) {
      throw new RangeError(`qty must be a positive integer: ${item.qty}`)
    }
  }

  // An empty cart costs nothing. This overrides the shipping rule below:
  // a subtotal of 0 is below freeShipFrom, so shipping on its own would
  // charge shipFee for a basket with nothing in it.
  if (items.length === 0) {
    return 0
  }

  let subtotal = 0
  for (const item of items) {
    subtotal += item.price * item.qty
  }

  // Free shipping is inclusive: reaching the threshold exactly is enough.
  const shipping = subtotal >= freeShipFrom ? 0 : shipFee

  return Math.round(subtotal + subtotal * vatRate + shipping)
}
