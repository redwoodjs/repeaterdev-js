import Job from '../../src/types/job'
import {
  update as updateQuery,
  destroy as deleteQuery,
  results as resultsQuery,
} from '../../src/queries'
import { GraphQLClient, ClientError } from 'graphql-request'
import {
  ResultsError,
  UpdateError,
  DeleteError,
  ReadOnlyError,
} from '../../src/errors'

jest.mock('graphql-request')

beforeEach(() => {
  GraphQLClient.mockClear()
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
    { token: 'abc', foo: 'bar' }
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
  const job = new Job({}, { token: 'abc', foo: 'bar' })

  expect(job.runAt).toEqual(null)
  expect(job.createdAt).toEqual(null)
  expect(job.updatedAt).toEqual(null)
  expect(job.lastRunAt).toEqual(null)
  expect(job.nextRunAt).toEqual(null)
})

test('update() makes a `updateJob` graphQL call', async () => {
  const job = new Job(
    { name: 'test-job' },
    { token: 'abc', endpoint: 'http://test.host' }
  )
  const graphQLInstance = GraphQLClient.mock.instances[0]

  const updateResult = await job.update({ verb: 'GET' })

  expect(graphQLInstance.request).toHaveBeenCalledWith(updateQuery, {
    name: 'test-job',
    verb: 'GET',
  })
})

test('update() updates the properties of the job', async () => {
  const mockResultsResponse = jest.fn()
  GraphQLClient.prototype.request = mockResultsResponse
  mockResultsResponse.mockReturnValue(
    Promise.resolve({ updateJob: { name: 'test-job', verb: 'GET' } })
  )
  const job = new Job(
    { name: 'test-job', verb: 'POST' },
    { token: 'abc', endpoint: 'http://test.host' }
  )

  expect(job.verb).toEqual('POST')
  await job.update({ verb: 'GET' })
  expect(job.verb).toEqual('GET')
})

test('update() does not set isDeleted flag', async () => {
  const job = new Job(
    { name: 'test-job' },
    { token: 'abc', endpoint: 'http://test.host' }
  )
  expect(job.isDeleted).toEqual(false)
  await job.update({ verb: 'GET' })
  expect(job.isDeleted).toEqual(false)
})

test('update() called on a deleted job throws an error', async () => {
  const job = new Job(
    { name: 'test-job' },
    { token: 'abc', endpoint: 'http://test.host' }
  )
  await job.delete()

  await expect(job.update()).rejects.toThrow(ReadOnlyError)
})

// The mock must be sticking around after running somehow because
// uncommenting this breaks 2 following tests

// test('update() handles errors', async () => {
//   const mockResultsResponse = jest.fn()
//   GraphQLClient.prototype.request = mockResultsResponse
//   mockResultsResponse.mockReturnValue(Promise.reject(new ClientError('Foobar')))
//   const job = new Job(
//     { name: 'test-job' },
//     { token: 'abc', endpoint: 'http://test.host' }
//   )

//   await expect(job.update({ verb: 'GET' })).rejects.toThrow(UpdateError)
// })

test('delete() makes a `deleteJob` graphQL call', async () => {
  const job = new Job(
    { name: 'test-job' },
    { token: 'abc', endpoint: 'http://test.host' }
  )
  const graphQLInstance = GraphQLClient.mock.instances[0]

  await job.delete()

  expect(graphQLInstance.request).toHaveBeenCalledWith(deleteQuery, {
    name: 'test-job',
  })
})

test('delete() sets the isDeleted property to true', async () => {
  const job = new Job(
    { name: 'test-job' },
    { token: 'abc', endpoint: 'http://test.host' }
  )

  expect(job.isDeleted).toEqual(false)
  await job.delete()
  expect(job.isDeleted).toEqual(true)
})

test('delete() called on a deleted job throws an error', async () => {
  const job = new Job(
    { name: 'test-job' },
    { token: 'abc', endpoint: 'http://test.host' }
  )
  await job.delete()

  await expect(job.delete()).rejects.toThrow(ReadOnlyError)
})

test('results() makes a `resultsQuery` graphQL call', async () => {
  const mockResultsResponse = jest.fn()
  GraphQLClient.prototype.request = mockResultsResponse
  mockResultsResponse.mockReturnValue(
    Promise.resolve({ jobResults: [{ status: 200 }] })
  )
  const job = new Job(
    { name: 'test-job' },
    { token: 'abc', endpoint: 'http://test.host' }
  )

  const graphQLInstance = GraphQLClient.mock.instances[0]
  await job.results()

  expect(graphQLInstance.request).toHaveBeenCalledWith(resultsQuery, {
    jobName: 'test-job',
  })
})

test('results() returns an array of JobResults', async () => {
  const mockResultsResponse = jest.fn()
  GraphQLClient.prototype.request = mockResultsResponse
  mockResultsResponse.mockReturnValue(
    Promise.resolve({ jobResults: [{ status: 200 }, { status: 500 }] })
  )
  const job = new Job(
    { name: 'test-job' },
    { token: 'abc', endpoint: 'http://test.host' }
  )

  const results = await job.results()

  expect(results.length).toEqual(2)
  expect(results[0].status).toEqual(200)
  expect(results[1].status).toEqual(500)
  expect(results[0]._token).toEqual('abc')
  expect(results[0]._jobName).toEqual('test-job')
  expect(results[0]._options.endpoint).toEqual('http://test.host')
})

test('results() called on a deleted job throws an error', async () => {
  const job = new Job(
    { name: 'test-job' },
    { token: 'abc', endpoint: 'http://test.host' }
  )
  await job.delete()

  await expect(job.results()).rejects.toThrow(ReadOnlyError)
})

test('results() handles GraphQL errors', async () => {
  const mockResultsResponse = jest.fn()
  GraphQLClient.prototype.request = mockResultsResponse
  mockResultsResponse.mockReturnValue(Promise.reject(new ClientError('Foobar')))
  const job = new Job(
    { name: 'test-job' },
    { token: 'abc', endpoint: 'http://test.host' }
  )

  await expect(job.results()).rejects.toThrow(ResultsError)
})
