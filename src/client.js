import { GraphQLClient } from 'graphql-request'
import { parse as durationParse } from 'iso8601-duration'
import { create } from './queries'
import { CreateError, ParameterError } from './errors'
import { merge } from './utility'

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

const DEFAULT_OPTIONS = {
  endpoint: API_ENDPOINT,
}

export class Client {
  constructor(token, options = {}) {
    this.setToken(token)
    this.setOptions(options)
    this.variables = {}
    this._initClient()
  }

  enqueue(params = {}) {
    if (this.variables.length === 0) {
      this.setVariables(params)
    }

    return this._request(create)
  }

  setToken(token) {
    if (!token) throw new ParameterError('token', requiredParams.token.required)

    this.token = token
  }

  setOptions(options) {
    this.options = merge(DEFAULT_OPTIONS, options)
  }

  setVariables(params) {
    this._validateParams(params)
    this.variables = this._normalizeParams(params)
  }

  _request(query) {
    return this.client.request(query, this.variables)
  }

  _initClient() {
    this.client = new GraphQLClient(this.options.endpoint, {
      headers: {
        authorization: `Bearer ${this.token}`,
      },
    })
  }

  _initVariables() {
    this.variables = {}
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
        durationParse(params.runEvery)
      } catch (e) {
        throw new ParameterError('runEvery', requiredParams.runEvery.format)
      }
    }
  }

  _normalizeParams(params) {
    const defaults = {
      enabled: true,
      retryable: true,
      runAt: new Date(),
    }
    const jsonHeader = { 'Content-Type': 'application/json' }

    const normalizedParams = merge(defaults, {
      name: params.name,
      enabled: params.enabled,
      endpoint: params.endpoint,
      verb: params.verb,
      headers: params.headers,
      body: params.body,
      retryable: params.retryable,
      runAt: params.runAt,
      runEvery: params.runEvery,
    })

    normalizedParams.verb = normalizedParams.verb.toUpperCase()

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

    if (typeof normalizedParams.headers === 'object') {
      normalizedParams.headers = JSON.stringify(normalizedParams.headers)
    }

    return normalizedParams
  }
}
