// Duplicates Ruby's merge where only non-null values from the second
// object are merged into the first.
export const merge = (obj1, obj2) => {
  let output = { ...obj1 }

  for (let key in obj2) {
    if (obj2[key] !== undefined && obj2[key] !== null) {
      output[key] = obj2[key]
    }
  }

  return output
}
