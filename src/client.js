import { GraphQLClient } from 'graphql-request'
import { parse as durationParse } from 'iso8601-duration'
import { create } from './queries'
import { CreateError, ParameterError } from './errors'
import { parse } from '@babel/core'

export const API_ENDPOINT = 'https://api.repeater.dev/graphql'

export const VERBS = [
  'GET',
  'POST',
  'PUT',
  'PATCH',
  'DELETE',
  'HEAD',
  'OPTIONS',
]

export const requiredParams = {
  token: {
    required: 'is required',
  },
  name: {
    required: 'is required',
  },
  verb: {
    required: `must be one of ${VERBS.join(' | ')}`,
  },
  endpoint: {
    required: 'is required',
    format: 'must look like a URL',
  },
  runAt: {
    format: 'must be a Date',
  },
  runEvery: {
    format: 'must be an ISO8601 Duration string',
  },
}

export class Client {
  DEFAULT_OPTIONS = {
    endpoint: API_ENDPOINT,
  }

  constructor(token, options = {}) {
    this._setToken(token)
    this._setOptions(options)
    this._initClient()
  }

  async enqueue(params) {
    this._validateParams(params)

    try {
      return await this._request(create, this._normalizeParams(params))
    } catch (e) {
      throw new CreateError(e.message)
    }
  }

  async _request() {
    return { data: {} }
  }

  _setToken(token) {
    if (!token) throw new ParameterError('token', requiredParams.token.required)

    this.token = token
  }

  _setOptions(options) {
    this.options = Object.assign(
      {
        endpoint: API_ENDPOINT,
      },
      options
    )
  }

  _initClient() {
    this.client = new GraphQLClient(this.options.endpoint, {
      headers: {
        authorization: `Bearer ${this.token}`,
      },
    })
  }

  _validateParams(params) {
    if (!params.name) {
      throw new ParameterError('name', requiredParams.name.required)
    }
    if (!VERBS.includes(params.verb?.toUpperCase())) {
      throw new ParameterError('verb', requiredParams.verb.required)
    }
    if (!params.endpoint) {
      throw new ParameterError('endpoint', requiredParams.endpoint.required)
    }
    if (!params.endpoint.match(/^https?:\/\//)) {
      throw new ParameterError('endpoint', requiredParams.endpoint.format)
    }
    if (
      params.runAt &&
      Object.prototype.toString.call(params.runAt) !== '[object Date]'
    ) {
      throw new ParameterError('runAt', requiredParams.runAt.format)
    }
    if (params.runEvery) {
      try {
        parse(runEvery)
      } catch (e) {
        throw new ParameterError('runEvery', requiredParams.runEvery.format)
      }
    }
  }

  _normalizeParams(params) {
    const normalizedParams = Object.assign(
      {
        enabled: true,
        headers: null,
        body: null,
        retryable: true,
        runAt: new Date(),
        runEvery: null,
      },
      {
        name: params.name,
        enabled: params.enabled,
        endpoint: params.endpoint,
        verb: params.verb,
        headers: params.headers,
        body: params.body || params.json,
        retryable: params.retryable,
        runAt: params.runAt,
        runEvery: params.runEvery,
      }
    )

    normalizedParams.verb = normalizedParams.verb.toUpperCase()

    if (!normalizedParams.headers) {
      delete normalizedParams.headers
    } else if (typeof normalizedParams.headers === 'object') {
      normalizedParams.headers = JSON.stringify(normalizedParams.headers)
    }

    if (!normalizedParams.body) {
      delete normalizedParams.body
    } else if (typeof normalizedParams.body === 'object') {
      normalizedParams.body = JSON.stringify(normalizedParams.body)
    }
  }
}
