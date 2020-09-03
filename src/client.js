import { GraphQLClient } from 'graphql-request'
import { create } from './queries'
import { CreateError } from './errors'

export class Client {
  DEFAULT_OPTIONS = {
    endpoint: 'https://api.repeater.dev/graphql',
  }

  constructor(token, options) {
    this.token = token
    this.setOptions(options)
    this.initClient()
  }

  setOptions(options) {
    this.options = Object.apply(
      {
        endpoint: 'https://api.repeater.dev/graphql',
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
      throw ParameterError('name', 'is required')
  }

  normalizeParams(params) {
    return params
  }
}
