import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import resolvers from './resolvers'
import { gql } from 'apollo-server-express'
import mocks from './mocks'

const typeDefs = gql`
type Query {
  author(firstName: String, lastName: String): Author
  allAuthors: [Author]
  getFortuneCookie: String @cacheControl(maxAge: 100)
}

type Subscription {
  postAdded(author: ID!): Post
}

type Mutation {
  createPost(input: PostInput): Post
}

input PostInput {
  title: String!
  text: String!
  author: ID
}

type Author {
  id: ID
  firstName: String
  lastName: String
  posts: [Post]
}

type Post {
  id: ID
  title: String
  text: String
  views: Int
  author: Author
}
`

const schema = makeExecutableSchema({ typeDefs, resolvers })

// addMockFunctionsToSchema({ schema, mocks })

export {schema, typeDefs}
