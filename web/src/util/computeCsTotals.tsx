export const computeTotal = (obj, sqftArea) => {
  const { units, charges, gst } = obj
  const { value } = units

  const chargesAre = Number(charges)
  if (value === 'costpersqft') {
    const total = Math.round(sqftArea * chargesAre)

    const gstTotal = Math.round(
      Number(sqftArea * chargesAre) * Number(gst?.value)
    )
    return total + gstTotal
  } else {
    return chargesAre
  }
}
