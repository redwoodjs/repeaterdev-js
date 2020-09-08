import { GraphQLClient } from 'graphql-request'

export const graphQLClient = (token, options) => {
  return new GraphQLClient(options.endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
}
