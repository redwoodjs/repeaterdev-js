import Job from '../../src/types/job'
import { GraphQLError, ReadOnlyError } from '../../src/errors'
import { endpoint, token } from '../testHelper'
import {
  mswServer,
  updateJobResponse,
  updateJobErrorResponse,
  deleteJobResponse,
  deleteJobErrorResponse,
  jobResultsResponse,
  jobResultsErrorResponse,
} from '../mockedResponses'

beforeAll(() => {
  mswServer.listen()
})

afterEach(() => {
  mswServer.resetHandlers()
})

afterAll(() => {
  mswServer.close()
})

test('parses job data on initialization', () => {
  const job = new Job(
    {
      name: 'test-job',
      enabled: true,
      body: 'foo=bar',
      endpoint: 'http://test.host',
      verb: 'POST',
      headers: '{"Content-Type":"text/plain"}',
      retryable: false,
      runAt: '2020-01-01T12:00:00Z',
      runEvery: 'P1D',
      createdAt: '2020-01-02T00:00:00Z',
      updatedAt: '2020-01-03T01:00:00Z',
      lastRunAt: '2020-01-04T02:00:00Z',
      nextRunAt: '2020-01-05T03:00:00Z',
    },
    { foo: 'bar', token, endpoint }
  )

  expect(job.name).toEqual('test-job')
  expect(job.enabled).toEqual(true)
  expect(job.body).toEqual('foo=bar')
  expect(job.endpoint).toEqual('http://test.host')
  expect(job.verb).toEqual('POST')
  expect(job.headers).toEqual({ 'Content-Type': 'text/plain' })
  expect(job.retryable).toEqual(false)
  expect(job.runAt).toEqual(new Date('2020-01-01T12:00:00Z'))
  expect(job.runEvery).toEqual('P1D')
  expect(job.createdAt).toEqual(new Date('2020-01-02T00:00:00Z'))
  expect(job.updatedAt).toEqual(new Date('2020-01-03T01:00:00Z'))
  expect(job.lastRunAt).toEqual(new Date('2020-01-04T02:00:00Z'))
  expect(job.nextRunAt).toEqual(new Date('2020-01-05T03:00:00Z'))
})

test('sets blank dates to null', () => {
  const job = new Job({}, { foo: 'bar', token, endpoint })

  expect(job.runAt).toEqual(null)
  expect(job.createdAt).toEqual(null)
  expect(job.updatedAt).toEqual(null)
  expect(job.lastRunAt).toEqual(null)
  expect(job.nextRunAt).toEqual(null)
})

test('update() updates the properties of the job', async () => {
  mswServer.resetHandlers(updateJobResponse)
  const job = new Job({ name: 'test-job', verb: 'POST' }, { token, endpoint })

  expect(job.verb).toEqual('POST')
  await job.update({ verb: 'GET' })
  expect(job.verb).toEqual('GET')
})

test('update() does not set isDeleted flag', async () => {
  mswServer.resetHandlers(updateJobResponse)
  const job = new Job({ name: 'test-job' }, { token, endpoint })

  expect(job.isDeleted).toEqual(false)
  await job.update({ verb: 'GET' })
  expect(job.isDeleted).toEqual(false)
})

test('update() called on a deleted job throws an error', async () => {
  mswServer.resetHandlers(deleteJobResponse)
  const job = new Job({ name: 'test-job' }, { token, endpoint })
  await job.delete()

  await expect(job.update()).rejects.toThrow(ReadOnlyError)
})

test('update() throws custom error if GraphQL error occurs', async () => {
  mswServer.resetHandlers(updateJobErrorResponse)
  const job = new Job({ name: 'test-job' }, { token, endpoint })

  await expect(job.update()).rejects.toThrow(GraphQLError)
})

test('delete() sets the isDeleted property to true', async () => {
  mswServer.resetHandlers(deleteJobResponse)
  const job = new Job({ name: 'test-job' }, { token, endpoint })

  expect(job.isDeleted).toEqual(false)
  await job.delete()
  expect(job.isDeleted).toEqual(true)
})

test('delete() called on a deleted job throws an error', async () => {
  mswServer.resetHandlers(deleteJobResponse)
  const job = new Job({ name: 'test-job' }, { token, endpoint })
  await job.delete()

  await expect(job.delete()).rejects.toThrow(ReadOnlyError)
})

test('delete() throws custom error if GraphQL error occurs', async () => {
  mswServer.resetHandlers(deleteJobErrorResponse)
  const job = new Job({ name: 'test-job' }, { token, endpoint })

  await expect(job.delete()).rejects.toThrow(GraphQLError)
})

test('results() returns an array of JobResults', async () => {
  mswServer.resetHandlers(jobResultsResponse)
  const job = new Job({ name: 'test-job' }, { token, endpoint })
  const results = await job.results()

  expect(results.length).toEqual(2)
  expect(results[0].status).toEqual(200)
  expect(results[1].status).toEqual(500)
})

test('results() passes through token, endpoint and jobName to JobResult instances', async () => {
  mswServer.resetHandlers(jobResultsResponse)
  const job = new Job({ name: 'test-job' }, { token, endpoint })
  const results = await job.results()

  expect(results[0]._token).toEqual(token)
  expect(results[0]._jobName).toEqual('test-job')
  expect(results[0]._options.endpoint).toEqual(endpoint)
})

test('results() called on a deleted job throws an error', async () => {
  mswServer.resetHandlers(deleteJobResponse)
  const job = new Job({ name: 'test-job' }, { token, endpoint })
  await job.delete()

  await expect(job.results()).rejects.toThrow(ReadOnlyError)
})

test('results() throws custom error if GraphQL error occurs', async () => {
  mswServer.resetHandlers(jobResultsErrorResponse)
  const job = new Job({ name: 'test-job' }, { token, endpoint })

  await expect(job.results()).rejects.toThrow(GraphQLError)
})
