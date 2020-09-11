export const repeaterErrorPrefix = ''

export class RepeaterError extends Error {
  constructor(message) {
    super(`${repeaterErrorPrefix}${message}`)
    this.name = 'RepeaterError'
  }
}

export class ReadOnlyError extends RepeaterError {
  constructor() {
    super('Job has been deleted and is read-only')
    this.name = 'ReadOnlyError'
  }
}

export class GraphQLError extends RepeaterError {
  constructor() {
    super('GraphQL Error: ')
    this.name = 'GraphQLError'
  }
}

export class ParameterError extends RepeaterError {
  constructor(field, message) {
    super(`Parameter error: ${field} ${message}`)
    this.name = 'ParameterError'
  }
}
