import { GraphQLClient } from 'graphql-request'
import { create } from './queries'
import { CreateError, ParameterError } from './errors'

export const API_ENDPOINT = 'https://api.repeater.dev/graphql'

export class Client {
  DEFAULT_OPTIONS = {
    endpoint: 'https://api.repeater.dev/graphql',
  }

  constructor(token, options = {}) {
    this.setToken(token)
    this.setOptions(options)
    this.initClient()
  }

  setToken(token) {
    if (!token) throw new ParameterError('token', 'is required')

    this.token = token
  }

  setOptions(options) {
    this.options = Object.assign(
      {
        endpoint: API_ENDPOINT,
      },
      options
    )
  }

  initClient() {
    this.client = new GraphQLClient(this.options.endpoint, {
      headers: {
        authorization: `Bearer ${this.token}`,
      },
    })
  }

  async enqueue(params) {
    this.validateParams(params)

    try {
      return await this.client.request(create, this.normalizeParams(params))
    } catch (e) {
      throw new CreateError(e.message)
    }
  }

  validateParams(params) {
    if (!params.name || params.name === '')
      throw new ParameterError('name', 'is required')
  }

  normalizeParams(params) {
    return params
  }
}
