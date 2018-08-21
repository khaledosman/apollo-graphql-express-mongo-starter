import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import compression from 'compression'
import { schema } from './data/schema'
import { db } from './connectors'
const ENGINE_API_KEY = 'service:khaledosman-6497:HWtZojohT6hsLfni36q2gQ'

const app = express()
app.use(compression())

const server = new ApolloServer({
  schema,
  tracing: true,
  cacheControl: true,
  engine: {
    apiKey: ENGINE_API_KEY
  },
  subscriptions: {
    // onConnect: (connectionParams, webSocket) => {
    //   if (connectionParams.authToken) {
    //     return validateToken(connectionParams.authToken)
    //       .then(findUser(connectionParams.authToken))
    //       .then(user => {
    //         return {
    //           currentUser: user
    //         }
    //       })
    //   }

    //   throw new Error('Missing auth token!')
    // }
  }
})
server.applyMiddleware({ app })
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)
