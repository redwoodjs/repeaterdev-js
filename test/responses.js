import { graphql } from 'msw'
import { setupServer } from 'msw/node'
import { endpoint } from './testHelper'

const localhost = graphql.link(endpoint)

export const mswServer = setupServer()

export const singleJobResponse = localhost.query(
  'JobQuery',
  (req, res, ctx) => {
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
  }
)

export const recurringJobResponse = localhost.query(
  'JobQuery',
  (req, res, ctx) => {
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
  }
)

export const jobErrorResponse = localhost.query('JobQuery', (req, res, ctx) => {
  return res(
    ctx.errors([
      {
        message: 'Mocked error response',
      },
    ])
  )
})

export const updateJobResponse = localhost.mutation(
  'UpdateJobMutation',
  (req, res, ctx) => {
    return res(
      ctx.data({
        updateJob: {
          __typename: 'Job',
          name: req.variables.name || 'test-job-1',
          enabled: true,
          body: 'foo=bar',
          endpoint: 'http://test.host/api/test',
          verb: req.variables.verb || 'HEAD',
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
  }
)

export const updateJobErrorResponse = localhost.mutation(
  'UpdateJobMutation',
  (req, res, ctx) => {
    return res(
      ctx.errors([
        {
          message: 'Mocked error response',
        },
      ])
    )
  }
)

export const deleteJobResponse = localhost.mutation(
  'DeleteJobMutation',
  (req, res, ctx) => {
    return res(
      ctx.data({
        deleteJob: {
          __typename: 'Job',
          name: req.variables.name || 'test-job-1',
        },
      })
    )
  }
)

export const deleteJobErrorResponse = localhost.mutation(
  'DeleteJobMutation',
  (req, res, ctx) => {
    return res(
      ctx.errors([
        {
          message: 'Mocked error response',
        },
      ])
    )
  }
)

export const jobResultsResponse = localhost.query(
  'JobResultsQuery',
  (req, res, ctx) => {
    return res(
      ctx.data({
        jobResults: [
          {
            __typename: 'JobResult',
            status: 200,
            body: 'foo=bar',
            headers: '{"Content-Type":"text/plain"}',
            runAt: '2020-01-01T00:00:00Z',
            run: 1,
            duration: 1000,
            createdAt: '2020-01-02T01:00:00Z',
            updatedAt: '2020-01-03T02:00:00Z',
          },
          {
            __typename: 'JobResult',
            status: 500,
            body: 'foo=bar',
            headers: '{"Content-Type":"text/plain"}',
            runAt: '2020-02-01T00:00:00Z',
            run: 2,
            duration: 500,
            createdAt: '2020-02-02T01:00:00Z',
            updatedAt: '2020-02-03T02:00:00Z',
          },
        ],
      })
    )
  }
)

export const jobResultsErrorResponse = localhost.query(
  'JobResultsQuery',
  (req, res, ctx) => {
    return res(
      ctx.errors([
        {
          message: 'Mocked error response',
        },
      ])
    )
  }
)
