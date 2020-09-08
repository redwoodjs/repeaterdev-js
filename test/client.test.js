import { API_ENDPOINT, Client, requiredParams } from '../src/client'
import { merge } from '../src/utility'
import MockDate from 'mockdate'
import { GraphQLClient } from 'graphql-request'
import { create as createQuery } from '../src/queries'

jest.mock('graphql-request')

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
})

afterEach(() => {
  MockDate.reset()
})

// constructor

test('constructor() without a token throws an error', () => {
  expect(() => {
    new Client()
  }).toThrow(`Parameter error: token ${requiredParams.token.required}`)
})

test('constructor() with an empty string as a token throws an error', () => {
  expect(() => {
    new Client('')
  }).toThrow(`Parameter error: token ${requiredParams.token.required}`)
})

test('constructor() with a token does not throw', () => {
  expect(() => new Client(TOKEN)).not.toThrow()
})

test('constructor() initializes GraphQLClient with endpoint and auth header', () => {
  expect(GraphQLClient).not.toHaveBeenCalled()

  new Client(TOKEN)

  expect(GraphQLClient).toHaveBeenCalledWith(API_ENDPOINT, {
    headers: { authorization: `Bearer ${TOKEN}` },
  })
})

// parameters

test('token is available as a parameter', () => {
  expect(new Client(TOKEN).token).toEqual(TOKEN)
})

test('options are available as a parameter', () => {
  expect(new Client(TOKEN, { foo: 'bar' }).options.foo).toEqual('bar')
})

test('options sets a default endpoint', () => {
  expect(new Client(TOKEN).options.endpoint).toEqual(API_ENDPOINT)
})

test('options.endpoint can be overridden', () => {
  expect(
    new Client(TOKEN, {
      endpoint: 'http://test.host',
    }).options.endpoint
  ).toEqual('http://test.host')
})

test('variables defaults `enabled` to true', () => {
  expect(new Client(TOKEN).variables.enabled).toEqual(true)
})

test('variables defaults `retryable` to true', () => {
  expect(new Client(TOKEN).variables.retryable).toEqual(true)
})

test('variables defaults `runAt` to now', () => {
  const now = new Date()
  MockDate.set(now)

  expect(new Client(TOKEN).variables.runAt).toEqual(now)
})
// setVariables

test('validate() throws an error if name is missing', () => {
  const client = new Client('abc')
  client.setVariables(paramsWithout('name'))

  expect(() => client.validate()).toThrow(
    `Parameter error: name ${requiredParams.name.required}`
  )
})

test('validate() throws an error if verb is missing', () => {
  const client = new Client('abc')
  client.setVariables(paramsWithout('verb'))

  expect(() => client.validate()).toThrow(
    `Parameter error: verb ${requiredParams.verb.required}`
  )
})

test('validate() throws an error if verb is not in the list of accepted values', () => {
  const client = new Client('abc')
  const params = merge(DEFAULT_PARAMS, { verb: 'FOO' })
  client.setVariables(params)

  expect(() => client.validate()).toThrow(
    `Parameter error: verb ${requiredParams.verb.required}`
  )
})

test('setVariables() throws an error if endpoint is missing', () => {
  const client = new Client('abc')
  client.setVariables(paramsWithout('endpoint'))

  expect(() => client.validate()).toThrow(
    `Parameter error: endpoint ${requiredParams.endpoint.required}`
  )
})

test('setVariables() throws an error if endpoint is not an URL', () => {
  const client = new Client('abc')
  const params = merge(DEFAULT_PARAMS, { endpoint: 'mydomain.com' })
  client.setVariables(params)

  expect(() => client.validate()).toThrow(
    `Parameter error: endpoint ${requiredParams.endpoint.format}`
  )
})

test('setVariables() throws an error if runAt is not a Date', () => {
  const client = new Client('abc')
  const params = merge(DEFAULT_PARAMS, { runAt: 'foobar' })
  client.setVariables(params)

  expect(() => client.validate()).toThrow(
    `Parameter error: runAt ${requiredParams.runAt.format}`
  )
})

test('setVariables() throws an error if runEvery is not a Duration', () => {
  const client = new Client('abc')
  const params = merge(DEFAULT_PARAMS, { runEvery: 'foobar' })
  client.setVariables(params)

  expect(() => client.validate()).toThrow(
    `Parameter error: runEvery ${requiredParams.runEvery.format}`
  )
})

test('setVariables() upcases the verb', () => {
  const client = new Client('abc')
  client.setVariables(merge(DEFAULT_PARAMS, { verb: 'post' }))

  expect(client.variables.verb).toEqual('POST')
})

test('setVariables() stringifies headers', () => {
  const client = new Client('abc')
  client.setVariables(
    merge(DEFAULT_PARAMS, { headers: { 'Content-Type': 'application/json' } })
  )

  expect(client.variables.headers).toEqual(
    `{\"Content-Type\":\"application/json\"}`
  )
})

test('setVariables() keeps body if present', () => {
  const client = new Client('abc')
  client.setVariables(merge(DEFAULT_PARAMS, { body: 'foo=bar' }))

  expect(client.variables.body).toEqual('foo=bar')
})

test('setVariables() sets body to stringified json if json params is present', () => {
  const client = new Client('abc')
  client.setVariables(merge(DEFAULT_PARAMS, { json: { foo: 'bar' } }))

  expect(client.variables.body).toEqual(`{\"foo\":\"bar\"}`)
})

test('setVariables() adds Content-Type header if json param present', () => {
  const client = new Client('abc')
  client.setVariables(merge(DEFAULT_PARAMS, { json: { foo: 'bar' } }))

  expect(client.variables.headers).toEqual(
    `{\"Content-Type\":\"application/json\"}`
  )
})

test('setVariables() adds Content-Type header to existing headers if json param present', () => {
  const client = new Client('abc')
  client.setVariables(
    merge(DEFAULT_PARAMS, { headers: { 'X-Foo': 'bar' }, json: { foo: 'bar' } })
  )

  expect(client.variables.headers).toEqual(
    `{\"X-Foo\":\"bar\",\"Content-Type\":\"application/json\"}`
  )
})

test('setVariables() stringifies headers', () => {
  const client = new Client('abc')
  client.setVariables(merge(DEFAULT_PARAMS, { headers: { 'X-Foo': 'bar' } }))

  expect(client.variables.headers).toEqual(`{\"X-Foo\":\"bar\"}`)
})

test('setVariables() can override boolean values', () => {
  const client = new Client('abc')
  client.setVariables(merge(DEFAULT_PARAMS, { enabled: false }))

  expect(client.variables.enabled).toEqual(false)
})

test('setVariables() called multiple times overrides existing values', () => {
  const client = new Client('abc')
  client.setVariables(merge(DEFAULT_PARAMS, { headers: { 'X-Foo': 'bar' } }))
  client.setVariables({ headers: { 'X-Baz': 'qux' } })

  expect(client.variables.headers).toEqual(`{\"X-Baz\":\"qux\"}`)
})

test('enqueue() makes a `createJob` graphQL call', () => {
  const client = new Client(TOKEN)
  const graphQLInstance = GraphQLClient.mock.instances[0]

  client.enqueue(DEFAULT_PARAMS)

  expect(graphQLInstance.request).toHaveBeenCalledWith(
    createQuery,
    client.variables
  )
})

// test('enqueue() returns an instance of Job', () => {
//   const client = new Client(TOKEN)
//   const graphQLInstance = GraphQLClient.mock.instances[0]
//   client.enqueue(DEFAULT_PARAMS)
//   const request = graphQLInstance.request

//   expect(request).toEqual('abc')
// })
