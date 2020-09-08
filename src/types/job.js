import {
  update as updateQuery,
  destroy as deleteQuery,
  results as resultsQuery,
} from '../queries'
import { UpdateError, DeleteError, ResultsError } from '../errors'
import Type from './type'
import JobResult from './jobResult'

export default class Job extends Type {
  parse = (data) => {
    this.name = data.name
    this.enabled = data.enabled
    this.body = data.body
    this.endpoint = data.endpoint
    this.verb = data.verb
    this.headers = data.headers
    this.body = data.body
    this.retryable = data.retryable
    this.runAt = data.runAt
    this.runEvery = data.runEvery
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
    this.lastRunAt = data.lastRunAt
    this.nextRunAt = data.nextRunAt
  }

  update = async (params) => {
    try {
      const data = await this._request(
        updateQuery,
        Object.assign({ name: this.name }, params)
      )
      this._reinitialize(data)
      return this
    } catch (error) {
      return new UpdateError(error.message)
    }
  }

  delete = async () => {
    try {
      await this.client.request(deleteQuery, { name: this.name })
      return this
    } catch (error) {
      throw new DeleteError(error.message)
    }
  }

  results = async () => {
    try {
      const data = await this.client.request(resultsQuery, {
        jobName: this.name,
      })
      return data.jobResults.map(
        (result) =>
          new JobResult(result, { token: this.token, ...this.options })
      )
    } catch (error) {
      throw new ResultsError(error.message)
    }
  }
}
