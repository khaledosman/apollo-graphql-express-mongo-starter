import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import resolvers from './resolvers'
import mocks from './mocks'

const typeDefs = `
type Query {
  author(firstName: String, lastName: String): Author
  allAuthors: [Author]
  getFortuneCookie: String @cacheControl(maxAge: 5)
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

export default schema
