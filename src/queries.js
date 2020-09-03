export const create = `
  mutation CreateJobMutation(
    $name: String!,
    $enabled: Boolean!,
    $endpoint: String!,
    $verb: String!,
    $headers: String!,
    $body: String!,
    $retryable: Boolean!
    $runAt: String!,
    $runEvery: String) {
    createOrUpdateJob(
      name: $name,
      enabled: $enabled,
      endpoint: $endpoint,
      verb: "post"
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
    }
  }
`
