import { job as jobQuery } from '../queries'
import { GraphQLError } from '../errors'
import Type from './type'
import Job from './job'

export default class JobResult extends Type {
  constructor(data, { jobName, ...options }) {
    super(data, options)
    this._jobName = jobName
  }

  parse(data) {
    this.status = data.status
    this.headers = data.headers ? JSON.parse(data.headers) : null
    this.body = data.body
    this.runAt = data.runAt ? new Date(data.runAt) : null
    this.run = data.run
    this.duration = data.duration
    this.createdAt = data.createdAt ? new Date(data.createdAt) : null
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null
  }

  async job() {
    try {
      const data = await this.client.request(jobQuery, {
        name: this._jobName,
      })
      return new Job(data.job, { token: this._token, ...this._options })
    } catch (error) {
      throw new GraphQLError(error.message)
    }
  }
}
