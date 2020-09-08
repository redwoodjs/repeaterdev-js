import Type from './type'

export default class JobResult extends Type {
  parse = (data) => {
    this.status = data.status
    this.headers = data.headers
    this.body = data.body
    this.runAt = data.runAt
    this.run = data.run
    this.duration = data.duration
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  job = () => {}
}
