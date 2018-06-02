import express from 'express'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import bodyParser from 'body-parser'
import compression from 'compression'
import { ApolloEngine  } from 'apollo-engine'
import { execute, subscribe } from 'graphql'
import { db } from './connectors'
import { createServer } from 'http'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import expressPlayground from 'graphql-playground-middleware-express'
import schema from './data/schema'

const GRAPHQL_PORT = 3000
const SUBSCRIPTIONS_PORT = GRAPHQL_PORT + 1
const ENGINE_API_KEY = 'service:khaledosman-6497:HWtZojohT6hsLfni36q2gQ'

const app = express()

const engine = new ApolloEngine({
  apiKey: ENGINE_API_KEY
})

app.use(compression())
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema, tracing: true, cacheControl: true }))
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${SUBSCRIPTIONS_PORT}/subscriptions`
}))
app.use('/playground', expressPlayground({
  endpoint: '/graphql',
  subscriptionEndpoint: `ws://localhost:${SUBSCRIPTIONS_PORT}/subscriptions`
}))

const websocketServer = createServer(app)
websocketServer.listen(SUBSCRIPTIONS_PORT, () => {
  console.log(`Apollo Server is now running on http://localhost:${SUBSCRIPTIONS_PORT}`)
  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: websocketServer,
    path: '/subscriptions'
  })
})


engine.listen({
  port: GRAPHQL_PORT,
  graphqlPaths: ['/api/graphql'],
  expressApp: app,
  launcherOptions: {
    startupTimeout: 3000,
  },
}, () => {
  console.log(`GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql`)
})