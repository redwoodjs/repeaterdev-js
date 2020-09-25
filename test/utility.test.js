import { merge, normalizeParams } from '../src/utility'

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

test('normalizeParams() upcases verb', async () => {
  const normalized = normalizeParams({ verb: 'post' })

  expect(normalized.verb).toEqual('POST')
})

test('normalizeParams() transforms json into body, appends header', async () => {
  const normalized = normalizeParams({ json: { bar: 'baz' } })

  expect(normalized.body).toEqual(`{"bar":"baz"}`)
  expect(normalized.json).toEqual(undefined)
  expect(normalized.headers).toEqual(`{"Content-Type":"application/json"}`)
})

test('normalizeParams() passes through regular body', async () => {
  const normalized = normalizeParams({ body: `foo=bar` })

  expect(normalized.body).toEqual(`foo=bar`)
  expect(normalized.json).toEqual(undefined)
  expect(normalized.headers).toEqual(undefined)
})

test('normalizeParams() prioritizes body over json', async () => {
  const normalized = normalizeParams({
    body: 'foo=bar',
    json: { bar: 'baz' },
  })
  expect(normalized.body).toEqual(`foo=bar`)
  expect(normalized.json).toEqual(undefined)
  expect(normalized.headers).toEqual(undefined)
})
