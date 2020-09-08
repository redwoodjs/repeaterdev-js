export const repeaterErrorPrefix = ''

export class RepeaterError extends Error {
  constructor(message) {
    super(`${repeaterErrorPrefix}${message}`)
    this.name = 'RepeaterError'
  }
}

export const jobsErrorPrefix = 'Could not list jobs: '

export class JobsError extends RepeaterError {
  constructor(message) {
    super(`${jobsErrorPrefix}${message}`)
    this.name = 'JobsError'
  }
}

export const resultsErrorPrefix = 'Could not list job results: '

export class ResultsError extends RepeaterError {
  constructor(message) {
    super(`${resultsErrorPrefix}${message}`)
    this.name = 'ResultsError'
  }
}

export const createErrorPrefix = 'Could not create job: '

export class CreateError extends RepeaterError {
  constructor(message) {
    super(`${createErrorPrefix}${message}`)
    this.name = 'CreateError'
  }
}

export const updateErrorPrefix = 'Could not update job: '

export class UpdateError extends RepeaterError {
  constructor(message) {
    super(`${updateErrorPrefix}${message}`)
    this.name = 'UpdateError'
  }
}

export const deleteErrorPrefix = 'Could not delete job: '

export class DeleteError extends RepeaterError {
  constructor(message) {
    super(`${deleteErrorPrefix}${message}`)
    this.name = 'DeleteError'
  }
}

const parameterErrorPrefix = 'Parameter error: '

export class ParameterError extends RepeaterError {
  constructor(field, message) {
    super(`${parameterErrorPrefix}${field} ${message}`)
    this.name = 'ParameterError'
  }
}
