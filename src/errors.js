export class RepeaterError extends Error {
  constructor(message) {
    super(message)
    this.name = 'RepeaterError'
  }
}

export class CreateError extends RepeaterError {
  constructor(message) {
    super(`Could not create job: ${message}`)
    this.name = 'CreateError'
  }
}

export class ParameterError extends RepeaterError {
  constructor(field, message) {
    super(`Parameter error: ${field} ${message}`)
    this.name = 'ParameterError'
  }
}
