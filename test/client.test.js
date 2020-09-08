import { API_ENDPOINT, Client, requiredParams } from '../src/client'
import { merge } from '../src/utility'
import MockDate from 'mockdate'

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

test('variables is available as a parameter, defaults to empty object', () => {
  expect(new Client(TOKEN).variables).toEqual({})
})

// setVariables

test('setVariables() throws an error if name is missing', () => {
  const client = new Client('abc')

  expect(() => client.setVariables(paramsWithout('name'))).toThrow(
    `Parameter error: name ${requiredParams.name.required}`
  )
})

test('setVariables() throws an error if verb is missing', () => {
  const client = new Client('abc')

  expect(() => client.setVariables(paramsWithout('verb'))).toThrow(
    `Parameter error: verb ${requiredParams.verb.required}`
  )
})

test('setVariables() throws an error if verb is not in the list of accepted values', () => {
  const client = new Client('abc')
  const params = merge(DEFAULT_PARAMS, { verb: 'FOO' })

  expect(() => client.setVariables(params)).toThrow(
    `Parameter error: verb ${requiredParams.verb.required}`
  )
})

test('setVariables() throws an error if endpoint is missing', () => {
  const client = new Client('abc')

  expect(() => client.setVariables(paramsWithout('endpoint'))).toThrow(
    `Parameter error: endpoint ${requiredParams.endpoint.required}`
  )
})

test('setVariables() throws an error if endpoint is not an URL', () => {
  const client = new Client('abc')
  const params = merge(DEFAULT_PARAMS, { endpoint: 'mydomain.com' })

  expect(() => client.setVariables(params)).toThrow(
    `Parameter error: endpoint ${requiredParams.endpoint.format}`
  )
})

test('setVariables() throws an error if runAt is not a Date', () => {
  const client = new Client('abc')
  const params = merge(DEFAULT_PARAMS, { runAt: 'foobar' })

  expect(() => client.setVariables(params)).toThrow(
    `Parameter error: runAt ${requiredParams.runAt.format}`
  )
})

test('setVariables() throws an error if runEvery is not a Duration', () => {
  const client = new Client('abc')
  const params = merge(DEFAULT_PARAMS, { runEvery: 'foobar' })

  expect(() => client.setVariables(params)).toThrow(
    `Parameter error: runEvery ${requiredParams.runEvery.format}`
  )
})

test('setVariables() defaults enabled to true', () => {
  const client = new Client('abc')
  client.setVariables(DEFAULT_PARAMS)

  expect(client.variables.enabled).toEqual(true)
})

test('setVariables() defaults enabled to true', () => {
  const client = new Client('abc')
  client.setVariables(DEFAULT_PARAMS)

  expect(client.variables.enabled).toEqual(true)
})

test('setVariables() defaults retryable to true', () => {
  const client = new Client('abc')
  client.setVariables(DEFAULT_PARAMS)

  expect(client.variables.retryable).toEqual(true)
})

test('setVariables() defaults runAt to now', () => {
  const now = new Date()
  MockDate.set(now)
  const client = new Client('abc')
  client.setVariables(paramsWithout('runAt'))

  expect(client.variables.runAt).toEqual(now)
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
