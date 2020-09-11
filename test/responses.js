import { graphql } from 'msw'

const localhost = graphql.link('http://localhost:3000/graphql')

export const singleJob = localhost.query('JobQuery', (req, res, ctx) => {
  return res(
    ctx.data({
      job: {
        __typename: 'Job',
        name: req.variables.name || 'test-job-1',
        enabled: true,
        body: 'foo=bar',
        endpoint: 'http://test.host/api/test',
        verb: 'GET',
        headers: '{"Content-Type":"text/plain"}',
        retryable: true,
        runAt: '2020-01-01T00:00:00Z',
        runEvery: null,
        createdAt: '2020-01-02T01:00:00Z',
        updatedAt: '2020-01-03T02:00:00Z',
        lastRunAt: null,
        nextRunAt: null,
      },
    })
  )
})

export const recurringJob = localhost.query('JobQuery', (req, res, ctx) => {
  return res(
    ctx.data({
      job: {
        __typename: 'Job',
        name: req.variables.name || 'test-job-1',
        enabled: true,
        body: 'foo=bar',
        endpoint: 'http://test.host/api/test',
        verb: 'GET',
        headers: '{"Content-Type":"text/plain"}',
        retryable: true,
        runAt: '2020-01-01T00:00:00Z',
        runEvery: 'P1H',
        createdAt: '2020-01-02T01:00:00Z',
        updatedAt: '2020-01-03T02:00:00Z',
        lastRunAt: '2020-01-04T03:00:00Z',
        nextRunAt: '2020-01-05T04:00:00Z',
      },
    })
  )
})

export const jobError = localhost.query('JobQuery', (req, res, ctx) => {
  return res(
    ctx.errors([
      {
        message: 'Mocked error response',
      },
    ])
  )
})
