import dotenv from 'dotenv'
import express from 'express'
import { ApolloServer, graphiqlExpress } from 'apollo-server-express'
import compression from 'compression'
import { schema } from './data/schema'
import { db } from './connectors'
import http from 'http'
dotenv.config()
const ENGINE_API_KEY = process.env.ENGINE_API_KEY

const app = express()
app.use(compression())
// app.use(
//   '/graphiql',
//   graphiqlExpress({
//     endpointURL: '/graphql'
//   })
// )
const server = new ApolloServer({
  schema,
  tracing: true,
  cacheControl: true,
  engine: {
    apiKey: ENGINE_API_KEY
  }
})
server.applyMiddleware({ app })
const httpServer = http.createServer(app)
server.installSubscriptionHandlers(httpServer)
httpServer.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
})
