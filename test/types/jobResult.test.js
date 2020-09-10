import JobResult from '../../src/types/jobResult'
import { job as jobQuery } from '../../src/queries'
import { GraphQLClient, ClientError } from 'graphql-request'
import { JobError } from '../../src/errors'

jest.mock('graphql-request')

beforeEach(() => {
  GraphQLClient.mockClear()
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

test('job() makes a `jobQuery` graphQL call', async () => {
  const mockResultsResponse = jest.fn()
  GraphQLClient.prototype.request = mockResultsResponse
  mockResultsResponse.mockReturnValue(
    Promise.resolve({ job: { name: 'test-job' } })
  )
  const result = new JobResult(
    {},
    { jobName: 'test-job', token: 'abc', endpoint: 'http://test.host' }
  )
  const graphQLInstance = GraphQLClient.mock.instances[0]
  await result.job()

  expect(graphQLInstance.request).toHaveBeenCalledWith(jobQuery, {
    name: 'test-job',
  })
})

test('job() returns a Job', async () => {
  const mockResultsResponse = jest.fn()
  GraphQLClient.prototype.request = mockResultsResponse
  mockResultsResponse.mockReturnValue(
    Promise.resolve({ job: { name: 'test-job' } })
  )
  const result = new JobResult(
    {},
    { jobName: 'test-job', token: 'abc', endpoint: 'http://test.host' }
  )

  const job = await result.job()

  expect(job.name).toEqual('test-job')
  expect(job._token).toEqual('abc')
  expect(job._options.endpoint).toEqual('http://test.host')
})

test('job() handles errors', async () => {
  const mockResultsResponse = jest.fn()
  GraphQLClient.prototype.request = mockResultsResponse
  mockResultsResponse.mockReturnValue(Promise.reject(new ClientError('Foobar')))
  const result = new JobResult(
    {},
    { jobName: 'test-job', token: 'abc', endpoint: 'http://test.host' }
  )
  const graphQLInstance = GraphQLClient.mock.instances[0]

  await expect(result.job()).rejects.toThrow(JobError)
})
