import { graphQLClient } from './graphql'
import {
  create as createQuery,
  jobs as jobsQuery,
  job as jobQuery,
} from './queries'
import { GraphQLError, ParameterError } from './errors'
import { merge, normalizeParams } from './utility'
import Job from './types/job'

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

export class Repeater {
  constructor(token, options = {}) {
    this.setToken(token)
    this.setOptions(options)
    this._initClient()
  }

  async enqueue(params = {}) {
    const defaultVariables = {
      enabled: true,
      retryable: true,
      runAt: new Date(),
    }
    const variables = normalizeParams(merge(defaultVariables, params))

    try {
      const data = await this.client.request(createQuery, variables)
      return new Job(data.createJob, {
        token: this._token,
        ...this._options,
      })
    } catch (error) {
      throw new GraphQLError(error.message)
    }
  }

  async enqueueOrUpdate(params = {}) {
    const job = await this.job(params.name)

    if (job) {
      return await job.update(params)
    } else {
      return await this.enqueue(params)
    }
  }

  async jobs() {
    try {
      const data = await this.client.request(jobsQuery)
      return data.jobs.map((job) => {
        return new Job(job, { token: this._token, ...this._options })
      })
    } catch (error) {
      throw new GraphQLError(error.message)
    }
  }

  async job(name) {
    try {
      const data = await this.client.request(jobQuery, { name })
      if (data.job) {
        return new Job(data.job, { token: this._token, ...this._options })
      } else {
        return null
      }
    } catch (error) {
      throw new GraphQLError(error.message)
    }
  }

  setToken(token) {
    if (!token) throw new ParameterError('token', requiredParams.token.required)

    this._token = token
  }

  setOptions(options) {
    this._options = merge(DEFAULT_OPTIONS, options)
  }

  _initClient() {
    this.client = graphQLClient(this._token, this._options)
  }
}
