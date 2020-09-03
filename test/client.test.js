import { API_ENDPOINT, Client } from '../src/client'

// constructor

test('initializing without a token throws an error', () => {
  expect(() => {
    new Client()
  }).toThrow('Parameter error: token is required')
})

test('initializing with an empty string as a token throws an error', () => {
  expect(() => {
    new Client('')
  }).toThrow('Parameter error: token is required')
})

test('initializing with a token does not throw', () => {
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

test('#validateParams throws an error if name is blank', () => {
  const client = new Client('abc')

  expect(() => {
    client.validateParams({})
  }).toThrow(`Parameter error: name is required`)
})
