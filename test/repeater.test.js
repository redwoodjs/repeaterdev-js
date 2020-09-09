import { API_ENDPOINT, Repeater, requiredParams } from '../src/repeater'
import { GraphQLClient } from 'graphql-request'
import MockDate from 'mockdate'
import {
  create as createQuery,
  jobs as jobsQuery,
  job as jobQuery,
} from '../src/queries'
import Job from '../src/types/job'
import { CreateError } from '../src/errors'

// freeze the clock
const now = new Date()
MockDate.set(now)

// mock out graphql-request always
jest.mock('graphql-request')

// mock out Job always
jest.mock('../src/types/job')

const TOKEN = '8ac0be4c06836527b63543ca70a84cb5'
const DEFAULT_PARAMS = {
  name: 'test-job',
  verb: 'GET',
  endpoint: 'https://test.host/function',
  runAt: new Date(),
  runEvery: 'P1D',
}

// removes a single key from list of DEFAULT_PARAMS
const paramsWithout = (name) => {
  const params = { ...DEFAULT_PARAMS }
  delete params[name]

  return params
}

beforeEach(() => {
  GraphQLClient.mockClear()
  Job.mockClear()
})

// constructor

test('constructor() without a token throws an error', () => {
  expect(() => {
    new Repeater()
  }).toThrow(`Parameter error: token ${requiredParams.token.required}`)
})

test('constructor() with an empty string as a token throws an error', () => {
  expect(() => {
    new Repeater('')
  }).toThrow(`Parameter error: token ${requiredParams.token.required}`)
})

test('constructor() with a token does not throw', () => {
  expect(() => new Repeater(TOKEN)).not.toThrow()
})

test('constructor() initializes GraphQLClient with endpoint and auth header', () => {
  expect(GraphQLClient).not.toHaveBeenCalled()

  new Repeater(TOKEN)

  expect(GraphQLClient).toHaveBeenCalledWith(API_ENDPOINT, {
    headers: { authorization: `Bearer ${TOKEN}` },
  })
})

// parameters

test('token is available as a parameter', () => {
  expect(new Repeater(TOKEN).token).toEqual(TOKEN)
})

test('options are available as a parameter', () => {
  expect(new Repeater(TOKEN, { foo: 'bar' }).options.foo).toEqual('bar')
})

test('options sets a default endpoint', () => {
  expect(new Repeater(TOKEN).options.endpoint).toEqual(API_ENDPOINT)
})

test('options.endpoint can be overridden', () => {
  expect(
    new Repeater(TOKEN, {
      endpoint: 'http://test.host',
    }).options.endpoint
  ).toEqual('http://test.host')
})

test('jobs() makes a `jobsQuery` graphQL call', () => {
  const client = new Repeater(TOKEN)
  const graphQLInstance = GraphQLClient.mock.instances[0]

  client.jobs()

  expect(graphQLInstance.request).toHaveBeenCalledWith(jobsQuery)
})

test('job() makes a `jobQuery` graphQL call', () => {
  const client = new Repeater(TOKEN)
  const graphQLInstance = GraphQLClient.mock.instances[0]

  client.job('test-job')

  expect(graphQLInstance.request).toHaveBeenCalledWith(jobQuery, {
    name: 'test-job',
  })
})

// enabled defaults to `true`
// retryable defaults to `true`
// runAt defaults to `new Date`
test('enqueue() makes a `createJob` graphQL call including default variables', () => {
  const client = new Repeater(TOKEN)
  const graphQLInstance = GraphQLClient.mock.instances[0]

  client.enqueue({ endpoint: 'http://test.host' })

  expect(graphQLInstance.request).toHaveBeenCalledWith(createQuery, {
    enabled: true,
    retryable: true,
    runAt: now,
    endpoint: 'http://test.host',
  })
})

test('enqueue() upcases the verb', () => {
  const client = new Repeater(TOKEN)
  const graphQLInstance = GraphQLClient.mock.instances[0]

  client.enqueue({ verb: 'get' })

  expect(graphQLInstance.request).toHaveBeenCalledWith(createQuery, {
    enabled: true,
    retryable: true,
    runAt: now,
    verb: 'GET',
  })
})

test('enqueue() keeps body if present', () => {
  const client = new Repeater(TOKEN)
  const graphQLInstance = GraphQLClient.mock.instances[0]

  client.enqueue({ body: 'foo=bar' })

  expect(graphQLInstance.request).toHaveBeenCalledWith(createQuery, {
    enabled: true,
    retryable: true,
    runAt: now,
    body: 'foo=bar',
  })
})

test('enqueue() sets body to stringified json if json params is present', () => {
  const client = new Repeater(TOKEN)
  const graphQLInstance = GraphQLClient.mock.instances[0]

  client.enqueue({ json: { foo: 'bar' } })

  expect(graphQLInstance.request).toHaveBeenCalledWith(createQuery, {
    enabled: true,
    retryable: true,
    runAt: now,
    body: '{"foo":"bar"}',
    headers: '{"Content-Type":"application/json"}',
  })
})

test('enqueue() adds Content-Type header to existing headers if json param present', () => {
  const client = new Repeater(TOKEN)
  const graphQLInstance = GraphQLClient.mock.instances[0]

  client.enqueue({ headers: { 'X-Foo': 'bar' }, json: { foo: 'bar' } })

  expect(graphQLInstance.request).toHaveBeenCalledWith(createQuery, {
    enabled: true,
    retryable: true,
    runAt: now,
    body: '{"foo":"bar"}',
    headers: `{\"X-Foo\":\"bar\",\"Content-Type\":\"application/json\"}`,
  })
})

test('enqueue() can override boolean values', () => {
  const client = new Repeater(TOKEN)
  const graphQLInstance = GraphQLClient.mock.instances[0]

  client.enqueue({ retryable: false })

  expect(graphQLInstance.request).toHaveBeenCalledWith(createQuery, {
    enabled: true,
    retryable: false,
    runAt: now,
  })
})

// the console.log() displays the expected return but the Job is never
// initialized?

// test('enqueue() initializes a Job with the response', () => {
//   GraphQLClient.mockImplementation(() => {
//     return {
//       request: () => {
//         return new Promise((resolve) => {
//           resolve({
//             data: {
//               job: { name: 'test-job' },
//             },
//           })
//         })
//       },
//     }
//   })
//   const client = new Repeater(TOKEN)

//   client.client.request().then((r) => console.log(r))

//   client.enqueue({ name: 'test-job' })

//   expect(Job).toHaveBeenCalledWith({ name: 'test-job' }, { token: TOKEN })
// })

// Can't get this error to raise

// test('enqueue() handles errors', () => {
//   GraphQLClient.mockImplementation(() => {
//     return {
//       request: () => {
//         throw new CreateError('Foobar')
//       },
//     }
//   })
//   const client = new Repeater(TOKEN)

//   expect(() => client.enqueue({ name: 'test-job' })).toThrow()
// })
