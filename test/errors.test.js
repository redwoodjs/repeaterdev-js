import { RepeaterError, CreateError, ParameterError } from '../src/errors'

test('RepeaterError name is RepeaterError', () => {
  const error = new RepeaterError('Foobar')

  expect(error.name).toEqual('RepeaterError')
})

test('RepeaterError contains no special text', () => {
  const error = new RepeaterError('Foobar')

  expect(error.message).toEqual('Foobar')
})

test('CreateError name is CreateError', () => {
  const error = new CreateError('Foobar')

  expect(error.name).toEqual('CreateError')
})

test('CreateError prepends the error message with text', () => {
  const error = new CreateError('Foobar')

  expect(error.message).toEqual('Could not create job: Foobar')
})

test('ParameterError name is ParameterError', () => {
  const error = new ParameterError('Foobar')

  expect(error.name).toEqual('ParameterError')
})

test('ParameterError prepends the error message with text', () => {
  const error = new ParameterError('Foobar', 'is nonsense')

  expect(error.message).toEqual('Parameter error: Foobar is nonsense')
})
