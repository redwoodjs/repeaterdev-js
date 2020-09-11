import JobResult from '../../src/types/jobResult'
import { JobError } from '../../src/errors'
import { endpoint, token } from '../testHelper'
import { setupServer } from 'msw/node'
import { singleJob, jobError } from '../responses'

const server = setupServer()

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

test('constructor() saves jobName to a property', () => {
  const jobResult = new JobResult({}, { jobName: 'test-job' })

  expect(jobResult._jobName).toEqual('test-job')
})

test('parses jobResult data on initialization', () => {
  const result = new JobResult(
    {
      status: 200,
      headers: '{"Content-Type":"text/plain"}',
      body: 'foo=bar',
      runAt: '2020-01-01T12:00:00Z',
      run: 1,
      duration: 123,
      createdAt: '2020-01-02T00:00:00Z',
      updatedAt: '2020-01-03T01:00:00Z',
    },
    { jobName: 'test-job' }
  )

  expect(result.status).toEqual(200)
  expect(result.headers).toEqual({ 'Content-Type': 'text/plain' })
  expect(result.body).toEqual('foo=bar')
  expect(result.runAt).toEqual(new Date('2020-01-01T12:00:00Z'))
  expect(result.run).toEqual(1)
  expect(result.duration).toEqual(123)
  expect(result.createdAt).toEqual(new Date('2020-01-02T00:00:00Z'))
  expect(result.updatedAt).toEqual(new Date('2020-01-03T01:00:00Z'))
})

test('sets blank dates to null', () => {
  const result = new JobResult({}, {})

  expect(result.runAt).toEqual(null)
  expect(result.createdAt).toEqual(null)
  expect(result.updatedAt).toEqual(null)
})

test('job() returns a Job', async () => {
  server.resetHandlers(singleJob)

  const result = new JobResult(
    { status: 200 },
    { jobName: 'test-job', token, endpoint }
  )
  const job = await result.job()

  expect(job.name).toEqual('test-job')
  expect(job._token).toEqual(token)
  expect(job._options.endpoint).toEqual(endpoint)
})

test('job() handles errors', async () => {
  server.resetHandlers(jobError)

  const result = new JobResult({}, { jobName: 'test-job', token, endpoint })

  await expect(result.job()).rejects.toThrow(JobError)
})
