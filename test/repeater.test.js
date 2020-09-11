import { API_ENDPOINT, Repeater, requiredParams } from '../src/repeater'
import MockDate from 'mockdate'
import { GraphQLError, ParameterError } from '../src/errors'
import { token, endpoint } from './testHelper'
import {
  mswServer,
  singleJobResponse,
  jobErrorResponse,
  nullJobResponse,
  jobsResponse,
  jobsErrorResponse,
  createJobResponse,
  createJobErrorResponse,
} from './mockedResponses'

const now = new Date()

beforeAll(() => {
  mswServer.listen()
  MockDate.set(now)
})

afterEach(() => {
  mswServer.resetHandlers()
})

afterAll(() => {
  MockDate.reset()
  mswServer.close()
})

// constructor

test('constructor() without a token throws an error', () => {
  expect(() => {
    new Repeater()
  }).toThrow(ParameterError)
})

test('constructor() with an empty string as a token throws an error', () => {
  expect(() => {
    new Repeater('')
  }).toThrow(ParameterError)
})

test('constructor() with a token does not throw', () => {
  expect(() => new Repeater(token)).not.toThrow()
})

// parameters

test('_token is available as a parameter', () => {
  expect(new Repeater(token)._token).toEqual(token)
})

test('_options are available as a parameter', () => {
  expect(new Repeater(token, { foo: 'bar' })._options.foo).toEqual('bar')
})

test('_options sets a default endpoint', () => {
  expect(new Repeater(token)._options.endpoint).toEqual(API_ENDPOINT)
})

test('options.endpoint can be overridden', () => {
  expect(new Repeater(token, { endpoint })._options.endpoint).toEqual(endpoint)
})

test('jobs() returns an array of jobs', async () => {
  mswServer.resetHandlers(jobsResponse)
  const client = new Repeater(token, { endpoint })
  const jobs = await client.jobs()

  expect(jobs.length).toEqual(2)
  expect(jobs[0].name).toEqual('test-job-1')
  expect(jobs[1].name).toEqual('test-job-2')
})

test('jobs() throws a custom error', async () => {
  mswServer.resetHandlers(jobsErrorResponse)
  const client = new Repeater(token, { endpoint })

  await expect(client.jobs()).rejects.toThrow(GraphQLError)
})

test('job() returns a job with the given name', async () => {
  mswServer.resetHandlers(singleJobResponse)
  const client = new Repeater(token, { endpoint })
  const job = await client.job('test-job-1')
})

test('job() returns null if job not found', async () => {
  mswServer.resetHandlers(nullJobResponse)
  const client = new Repeater(token, { endpoint })
  const job = await client.job('test-job-99')

  expect(job).toEqual(null)
})

test('job() throws a custom error', async () => {
  mswServer.resetHandlers(jobErrorResponse)
  const client = new Repeater(token, { endpoint })

  await expect(client.job('test-job-1')).rejects.toThrow(GraphQLError)
})

test('enqueue() upcases the verb', async () => {
  mswServer.resetHandlers(createJobResponse)
  const client = new Repeater(token, { endpoint })
  const random = Math.round(Math.random() * 100)
  const job = await client.enqueue({
    name: `test-job-${random}`,
    verb: 'get',
    endpoint: `http://test.host/api/${random}`,
  })

  expect(job.verb).toEqual('GET')
})

test('enqueue() keeps body if present', async () => {
  mswServer.resetHandlers(createJobResponse)
  const client = new Repeater(token, { endpoint })
  const random = Math.round(Math.random() * 100)
  const job = await client.enqueue({
    name: `test-job-${random}`,
    verb: 'get',
    endpoint: `http://test.host/api/${random}`,
    body: `foo=${random}`,
  })

  expect(job.body).toEqual(`foo=${random}`)
})

test('enqueue() sets body to stringified json if json params is present', async () => {
  mswServer.resetHandlers(createJobResponse)
  const client = new Repeater(token, { endpoint })
  const random = Math.round(Math.random() * 100)
  const job = await client.enqueue({
    name: `test-job-${random}`,
    verb: 'get',
    endpoint: `http://test.host/api/${random}`,
    json: { foo: random.toString() },
  })

  expect(job.body).toEqual(`{"foo":"${random}"}`)
})

test('enqueue() adds Content-Type header to empty headers if json param present', async () => {
  mswServer.resetHandlers(createJobResponse)
  const client = new Repeater(token, { endpoint })
  const random = Math.round(Math.random() * 100)
  const job = await client.enqueue({
    name: `test-job-${random}`,
    verb: 'get',
    endpoint: `http://test.host/api/${random}`,
    json: { foo: random.toString() },
  })

  expect(job.headers).toEqual({
    'Content-Type': 'application/json',
  })
})

test('enqueue() adds Content-Type header to existing headers if json param present', async () => {
  mswServer.resetHandlers(createJobResponse)
  const client = new Repeater(token, { endpoint })
  const random = Math.round(Math.random() * 100)
  const job = await client.enqueue({
    name: `test-job-${random}`,
    verb: 'get',
    endpoint: `http://test.host/api/${random}`,
    json: { foo: random.toString() },
    headers: { 'X-Foo': 'bar' },
  })

  expect(job.headers).toEqual({
    'X-Foo': 'bar',
    'Content-Type': 'application/json',
  })
})

test('enqueue() can override boolean values', async () => {
  mswServer.resetHandlers(createJobResponse)
  const client = new Repeater(token, { endpoint })
  const random = Math.round(Math.random() * 100)
  const job = await client.enqueue({
    name: `test-job-${random}`,
    verb: 'get',
    endpoint: `http://test.host/api/${random}`,
    retryable: false,
  })

  expect(job.retryable).toEqual(false)
})

test('enqueue() sets some default values', async () => {
  mswServer.resetHandlers(createJobResponse)
  const client = new Repeater(token, { endpoint })
  const random = Math.round(Math.random() * 100)
  const job = await client.enqueue({
    name: `test-job-${random}`,
    verb: 'get',
    endpoint: `http://test.host/api/${random}`,
  })

  expect(job.enabled).toEqual(true)
  expect(job.retryable).toEqual(true)
  expect(job.runAt).toEqual(now)
})

test('enqueue() throw custom error', async () => {
  mswServer.resetHandlers(createJobErrorResponse)
  const client = new Repeater(token, { endpoint })

  await expect(
    client.enqueue({
      name: 'test-job-1',
      verb: 'get',
      endpoint: 'http://test.host/api',
    })
  ).rejects.toThrow(GraphQLError)
})
