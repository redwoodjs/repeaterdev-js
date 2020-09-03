import Client from '../src/client'

test('#validateParams throws an error if name is blank', () => {
  const client = new Client('abc')

  expect(() => {
    client.validateParams({})
  }).toThrow(`Parameter error: name is required`)
})
