export default class JobResult {
  constructor(data, { token, ...options }) {
    this._initialize(data)
  }

  job = () => {}

  _initialize = (data) => {
    this.status = data.status
    this.headers = data.headers
    this.body = data.body
    this.runAt = data.runAt
    this.run = data.run
    this.duration = data.duration
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  _reinitialize = (data) => {
    this._initialize(data)
  }
}
