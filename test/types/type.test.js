import { API_ENDPOINT } from '../../src/repeater'
import { GraphQLClient } from 'graphql-request'
import Type from '../../src/types/type'

jest.mock('graphql-request')

beforeEach(() => {
  GraphQLClient.mockClear()
})

test('constructor() saves the given token', () => {
  const type = new Type({}, { token: 'abc' })

  expect(type.token).toEqual('abc')
  expect(type.options).toEqual({})
})

test('constructor() saves any additional options', () => {
  const type = new Type({}, { token: 'abc', foo: 'bar' })

  expect(type.options).toEqual({ foo: 'bar' })
})

test('constructor() saves the passed data', () => {
  const type = new Type({ foo: 'bar' }, { token: 'abc' })

  expect(type.data).toEqual({ foo: 'bar' })
})

test('constructor() initializes the GraphQL client', () => {
  new Type({}, { token: 'abc', endpoint: 'http://test.host' })

  expect(GraphQLClient).toHaveBeenCalledWith('http://test.host', {
    headers: { authorization: `Bearer abc` },
  })
})
