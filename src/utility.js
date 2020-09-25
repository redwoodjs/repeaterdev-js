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

export const normalizeParams = (params) => {
  const jsonHeader = { 'Content-Type': 'application/json' }

  const normalizedParams = params

  normalizedParams.verb = normalizedParams.verb?.toUpperCase()

  if (!normalizedParams.body) {
    if (params.json) {
      normalizedParams.body = JSON.stringify(params.json)
      normalizedParams.headers = normalizedParams.headers
        ? merge(normalizedParams.headers, jsonHeader)
        : jsonHeader
    } else {
      delete normalizedParams.body
    }
  }
  delete normalizedParams.json

  if (typeof normalizedParams.headers === 'object') {
    normalizedParams.headers = JSON.stringify(normalizedParams.headers)
  }

  return normalizedParams
}
