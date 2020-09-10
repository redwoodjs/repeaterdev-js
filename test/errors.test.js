import {
  RepeaterError,
  ReadOnlyError,
  JobsError,
  JobError,
  ResultsError,
  CreateError,
  UpdateError,
  DeleteError,
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

test('ReadOnlyError sets its own message', () => {
  const error = new ReadOnlyError('Foobar')

  expect(error.message).toMatch(/read-only/)
  expect(error.message).not.toMatch(/Foobar/)
})

test('JobsError name is JobsError', () => {
  const error = new JobsError('Foobar')

  expect(error.name).toEqual('JobsError')
})

test('JobsError sets a message', () => {
  const error = new JobsError('Foobar')

  expect(error.message).toMatch(/list jobs/)
  expect(error.message).toMatch(/Foobar/)
})

test('JobError name is JobError', () => {
  const error = new JobError('Foobar')

  expect(error.name).toEqual('JobError')
})

test('JobError sets a message', () => {
  const error = new JobError('Foobar')

  expect(error.message).toMatch(/retrieve job/)
  expect(error.message).toMatch(/Foobar/)
})

test('ResultsError name is ResultsError', () => {
  const error = new ResultsError('Foobar')

  expect(error.name).toEqual('ResultsError')
})

test('ResultsError sets a message', () => {
  const error = new ResultsError('Foobar')

  expect(error.message).toMatch(/list job results/)
  expect(error.message).toMatch(/Foobar/)
})

test('CreateError name is CreateError', () => {
  const error = new CreateError('Foobar')

  expect(error.name).toEqual('CreateError')
})

test('CreateError prepends the error message with text', () => {
  const error = new CreateError('Foobar')

  expect(error.message).toMatch(/create job/)
  expect(error.message).toMatch(/Foobar/)
})

test('UpdateError name is UpdateError', () => {
  const error = new UpdateError('Foobar')

  expect(error.name).toEqual('UpdateError')
})

test('UpdateError prepends the error message with text', () => {
  const error = new UpdateError('Foobar')

  expect(error.message).toMatch(/update job/)
  expect(error.message).toMatch(/Foobar/)
})

test('DeleteError name is DeleteError', () => {
  const error = new DeleteError('Foobar')

  expect(error.name).toEqual('DeleteError')
})

test('DeleteError prepends the error message with text', () => {
  const error = new DeleteError('Foobar')

  expect(error.message).toMatch(/delete job/)
  expect(error.message).toMatch(/Foobar/)
})

test('ParameterError name is ParameterError', () => {
  const error = new ParameterError('Foobar')

  expect(error.name).toEqual('ParameterError')
})

test('ParameterError prepends the error message with text', () => {
  const error = new ParameterError('Foobar', 'is nonsense')

  expect(error.message).toEqual('Parameter error: Foobar is nonsense')
})
