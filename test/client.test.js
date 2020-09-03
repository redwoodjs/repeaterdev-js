import { API_ENDPOINT, Client, requiredParams } from '../src/client'

const DEFAULT_PARAMS = {
  name: 'test-job',
  verb: 'GET',
  endpoint: 'https://test.host/function',
  runAt: new Date(),
  runEvery: 'P1D',
}

// properly clones an object
const clone = (obj, merge = {}) => {
  return { ...obj, ...merge }
}

// removes a single key from list of DEFAULT_PARAMS
const paramsWithout = (name) => {
  const params = clone(DEFAULT_PARAMS)
  delete params[name]

  return params
}

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
  expect(() => {
    new Client('8ac0be4c06836527b63543ca70a84cb5')
  }).not.toThrow()
})

test('token is available as a parameter', () => {
  expect(new Client('8ac0be4c06836527b63543ca70a84cb5').token).toEqual(
    '8ac0be4c06836527b63543ca70a84cb5'
  )
})

test('options are available as a parameter', () => {
  expect(
    new Client('8ac0be4c06836527b63543ca70a84cb5', { foo: 'bar' }).options.foo
  ).toEqual('bar')
})

test('options sets a default endpoint', () => {
  expect(
    new Client('8ac0be4c06836527b63543ca70a84cb5').options.endpoint
  ).toEqual(API_ENDPOINT)
})

test('options.endpoint can be overridden', () => {
  expect(
    new Client('8ac0be4c06836527b63543ca70a84cb5', {
      endpoint: 'http://test.host',
    }).options.endpoint
  ).toEqual('http://test.host')
})

test('enqueue() throws an error if name is blank', async () => {
  const client = new Client('abc')

  await expect(client.enqueue({})).rejects.toThrow(
    `Parameter error: name ${requiredParams.name.required}`
  )
})

test('enqueue() throws an error if name is blank', async () => {
  const client = new Client('abc')

  await expect(client.enqueue(paramsWithout('name'))).rejects.toThrow(
    `Parameter error: name ${requiredParams.name.required}`
  )
})

test('enqueue() throws an error if verb is blank', async () => {
  const client = new Client('abc')

  await expect(client.enqueue(paramsWithout('verb'))).rejects.toThrow(
    `Parameter error: verb ${requiredParams.verb.required}`
  )
})

// test('enqueue() does not care if verb is lowercase', async () => {
//   const client = new Client('abc')
//   const params = clone(DEFAULT_PARAMS, { verb: 'get' })

//   await expect(client.enqueue(params)).resolves.not.toThrow()
// })

test('enqueue() throws an error if endpoint is blank', async () => {
  const client = new Client('abc')

  await expect(client.enqueue(paramsWithout('endpoint'))).rejects.toThrow(
    `Parameter error: endpoint ${requiredParams.endpoint.required}`
  )
})

test('enqueue() throws an error if endpoint is not an URL', async () => {
  const client = new Client('abc')
  const params = clone(DEFAULT_PARAMS, { endpoint: 'mydomain.com' })

  await expect(client.enqueue(params)).rejects.toThrow(
    `Parameter error: endpoint ${requiredParams.endpoint.format}`
  )
})

test('enqueue() throws an error if runAt is not a Date', async () => {
  const client = new Client('abc')
  const params = clone(DEFAULT_PARAMS, { runAt: 'foobar' })

  await expect(client.enqueue(params)).rejects.toThrow(
    `Parameter error: runAt ${requiredParams.runAt.format}`
  )
})

test('enqueue() throws an error if runEvery is not a Duration', async () => {
  const client = new Client('abc')
  const params = clone(DEFAULT_PARAMS, { runEvery: 'foobar' })

  await expect(client.enqueue(params)).rejects.toThrow(
    `Parameter error: runEvery ${requiredParams.runEvery.format}`
  )
})
