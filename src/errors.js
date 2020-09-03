export const repeaterErrorPrefix = ''

export class RepeaterError extends Error {
  constructor(message) {
    super(`${repeaterErrorPrefix}${message}`)
    this.name = 'RepeaterError'
  }
}

export const createErrorPrefix = 'Could not create job: '

export class CreateError extends RepeaterError {
  constructor(message) {
    super(`${createErrorPrefix}${message}`)
    this.name = 'CreateError'
  }
}

const parameterErrorPrefix = 'Parameter error: '

export class ParameterError extends RepeaterError {
  constructor(field, message) {
    super(`${parameterErrorPrefix}${field} ${message}`)
    this.name = 'ParameterError'
  }
}
