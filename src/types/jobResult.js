import { job as jobQuery } from '../queries'
import { JobError } from '../errors'
import Type from './type'
import Job from './job'

export default class JobResult extends Type {
  constructor(data, { jobName, ...options }) {
    super(data, options)
    this.jobName = jobName
  }

  parse(data) {
    this.status = data.status
    this.headers = data.headers
    this.body = data.body
    this.runAt = data.runAt
    this.run = data.run
    this.duration = data.duration
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  async job() {
    try {
      const data = await this.client.request(jobQuery, {
        name: this.jobName,
      })
      return new Job(data.job, { token: this.token, ...this.options })
    } catch (error) {
      throw new JobError(error.message)
    }
  }
}
