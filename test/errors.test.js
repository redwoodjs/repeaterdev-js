import {
  RepeaterError,
  ReadOnlyError,
  GraphQLError,
  ParameterError,
} from '../src/errors'

test('RepeaterError name is RepeaterError', () => {
  const error = new RepeaterError('Foobar')

  expect(error.name).toEqual('RepeaterError')
})

test('RepeaterError contains no special text', () => {
  const error = new RepeaterError('Foobar')

  expect(error.message).toEqual('Foobar')
})

test('ReadOnlyError name is ReadOnlyError', () => {
  const error = new ReadOnlyError('Foobar')

  expect(error.name).toEqual('ReadOnlyError')
})

test('GraphQLError sets its own message', () => {
  const error = new GraphQLError('Foobar')

  expect(error.message).toMatch(/GraphQL Error/)
  expect(error.message).not.toMatch(/Foobar/)
})

test('GraphQLError name is GraphQLError', () => {
  const error = new GraphQLError('Foobar')

  expect(error.name).toEqual('GraphQLError')
})

test('ReadOnlyError sets its own message', () => {
  const error = new ReadOnlyError('Foobar')

  expect(error.message).toMatch(/read-only/)
  expect(error.message).not.toMatch(/Foobar/)
})

test('ParameterError name is ParameterError', () => {
  const error = new ParameterError('Foobar')

  expect(error.name).toEqual('ParameterError')
})

test('ParameterError prepends the error message with text', () => {
  const error = new ParameterError('Foobar', 'is nonsense')

  expect(error.message).toEqual('Parameter error: Foobar is nonsense')
})
