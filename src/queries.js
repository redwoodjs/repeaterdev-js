export const jobs = `
  query JobsQuery {
    jobs {
      name
      enabled
      body
      endpoint
      verb
      headers
      body
      retryable
      runAt
      runEvery
      createdAt
      updatedAt
      lastRunAt
      nextRunAt
    }
  }
`

export const job = `
  query JobQuery($name: String!) {
    job(name: $name) {
      name
      enabled
      body
      endpoint
      verb
      headers
      body
      retryable
      runAt
      runEvery
      createdAt
      updatedAt
      lastRunAt
      nextRunAt
    }
  }
`

export const create = `
  mutation CreateJobMutation(
    $name: String!,
    $enabled: Boolean!,
    $endpoint: String!,
    $verb: String!,
    $headers: String,
    $body: String,
    $retryable: Boolean!
    $runAt: String!,
    $runEvery: String) {
    createJob(
      name: $name,
      enabled: $enabled,
      endpoint: $endpoint,
      verb: $verb
      headers: $headers,
      body: $body,
      retryable: $retryable,
      runAt: $runAt,
      runEvery: $runEvery
    ) {
      name
      enabled
      body
      endpoint
      verb
      headers
      body
      retryable
      runAt
      runEvery
      createdAt
      updatedAt
    }
  }
`

export const update = `
  mutation UpdateJobMutation(
    $name: String!,
    $enabled: Boolean,
    $endpoint: String,
    $verb: String,
    $headers: String,
    $body: String,
    $retryable: Boolean
    $runAt: String,
    $runEvery: String) {
    updateJob(
      name: $name,
      enabled: $enabled,
      endpoint: $endpoint,
      verb: $verb,
      headers: $headers,
      body: $body,
      retryable: $retryable,
      runAt: $runAt,
      runEvery: $runEvery
    ) {
      name
      enabled
      body
      endpoint
      verb
      headers
      body
      retryable
      runAt
      runEvery
      createdAt
      updatedAt
    }
  }
`

export const destroy = `
  mutation DeleteJobMutation($name: String!) {
    deleteJob(name: $name) {
      name
    }
  }
`

export const results = `
  query JobResultsQuery($jobName: String!) {
    jobResults(jobName: $jobName) {
      status
      headers
      body
      runAt
      run
      duration
      createdAt
      updatedAt
    }
  }
`
