import express from 'express'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import bodyParser from 'body-parser'
import compression from 'compression'
import { Engine } from 'apollo-engine'
import { execute, subscribe } from 'graphql'
import { db } from './connectors'
import { createServer } from 'http'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import expressPlayground from 'graphql-playground-middleware-express'
import url from 'url'
import schema from './data/schema'

const GRAPHQL_PORT = 3000
const SUBSCRIPTIONS_PORT = GRAPHQL_PORT + 1
const ENGINE_API_KEY = 'service:khaledosman-6497:HWtZojohT6hsLfni36q2gQ'

const graphQLServer = express()
const engine = new Engine({
  engineConfig: {
    apiKey: ENGINE_API_KEY,
    stores: [
      {
        name: 'inMemEmbeddedCache',
        inMemory: {
          cacheSize: 20971520 // 20 MB
        }
      }
    ],
    queryCache: {
      publicFullQueryStore: 'inMemEmbeddedCache'
    }
  },
  graphqlPort: GRAPHQL_PORT
})

engine.start()

graphQLServer.use(engine.expressMiddleware())
graphQLServer.use(compression())
graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({ schema, tracing: true, cacheControl: true }))
graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${SUBSCRIPTIONS_PORT}/subscriptions`}))
graphQLServer.use('/playground', expressPlayground({endpoint: '/graphql',
  subscriptionEndpoint: url.format({
    host: `localhost:${SUBSCRIPTIONS_PORT}`,
    protocol: 'ws',
    slashes: true,
    pathname: '/subscriptions'
  })}))
// graphQLServer.use('/playground', expressPlayground({endpoint: '/graphql', subscriptionEndpoint: `/subscriptions`}))

// Wrap the Express server
const ws = createServer(graphQLServer)
ws.listen(SUBSCRIPTIONS_PORT, () => {
  console.log(`Apollo Server is now running on http://localhost:${SUBSCRIPTIONS_PORT}`)
  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer({
    execute,
    subscribe,
    schema
  }, {
    server: ws,
    path: '/subscriptions'
  })
})

graphQLServer.listen(GRAPHQL_PORT, () =>
  console.log(
    `GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql`
  )
)
