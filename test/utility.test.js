import { merge } from '../src/utility'

test('merge() merges two objects', () => {
  const output = merge({ foo: 'bar' }, { baz: 'qux' })

  expect(output.foo).toEqual('bar')
  expect(output.baz).toEqual('qux')
})

test('merge() ignores null values when merging', () => {
  const output = merge({ foo: 'bar' }, { baz: null })

  expect(output.foo).toEqual('bar')
  expect('baz' in output).toEqual(false)
})

test('merge() ignores undefined values when merging', () => {
  const output = merge({ foo: 'bar' }, { baz: undefined })

  expect(output.foo).toEqual('bar')
  expect('baz' in output).toEqual(false)
})

test('merge() prioritizes values in second object over values in first', () => {
  const output = merge({ foo: 'bar' }, { foo: 'baz' })

  expect(output.foo).toEqual('baz')
})
