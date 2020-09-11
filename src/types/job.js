import {
  update as updateQuery,
  destroy as deleteQuery,
  results as resultsQuery,
} from '../queries'
import { GraphQLError, ReadOnlyError } from '../errors'
import Type from './type'
import JobResult from './jobResult'

export default class Job extends Type {
  parse(data) {
    this.name = data.name || this.name
    this.enabled = data.enabled || this.enabled
    this.body = data.body || this.body
    this.endpoint = data.hasOwnProperty('endpoint')
      ? data.endpoint
      : this.endpoint
    this.verb = data.verb || this.verb
    this.headers = data.headers ? JSON.parse(data.headers) : this.headers
    this.retryable = data.hasOwnProperty('retryable')
      ? data.retryable
      : this.retryable
    this.runAt = data.runAt ? new Date(data.runAt) : this.runAt || null
    this.runEvery = data.runEvery || this.runEvery
    this.createdAt = data.createdAt
      ? new Date(data.createdAt)
      : this.createdAt || null
    this.updatedAt = data.updatedAt
      ? new Date(data.updatedAt)
      : this.updatedAt || null
    this.lastRunAt = data.lastRunAt
      ? new Date(data.lastRunAt)
      : this.lastRunAt || null
    this.nextRunAt = data.nextRunAt
      ? new Date(data.nextRunAt)
      : this.nextRunAt || null
  }

  async update(params) {
    if (this.isDeleted) throw new ReadOnlyError()

    try {
      const data = await this.client.request(
        updateQuery,
        Object.assign({ name: this.name }, params)
      )
      this.parse(data.updateJob)
      return this
    } catch (error) {
      throw new GraphQLError(error.message)
    }
  }

  async delete() {
    if (this.isDeleted) throw new ReadOnlyError()

    try {
      await this.client.request(deleteQuery, { name: this.name })
      this.isDeleted = true
      return this
    } catch (error) {
      throw new GraphQLError(error.message)
    }
  }

  async results() {
    if (this.isDeleted) throw new ReadOnlyError()

    try {
      const data = await this.client.request(resultsQuery, {
        jobName: this.name,
      })

      return data.jobResults.map(
        (result) =>
          new JobResult(result, {
            token: this._token,
            jobName: this.name,
            ...this._options,
          })
      )
    } catch (error) {
      throw new GraphQLError(error.message)
    }
  }
}
