# apollo-tutorial-kit

Starting point for the Apollo GraphQL Server tutorial.

See also [Tutorial: How to build a GraphQL server](https://medium.com/apollo-stack/tutorial-building-a-graphql-server-cddaa023c035#.wy5h1htxs) and the solution in the `server-tutorial-solution-Nov2017` branch of this repo.

Up-to-date documentation and explanations can be found in the [Apollo Server 1.2.0 Documentation](https://www.apollographql.com/docs/apollo-server/)

## Getting started

```
git clone https://github.com/apollostack/apollo-starter-kit
cd apollo-starter-kit
npm install
npm run start
```

Then open [http://localhost:3000/graphiql](http://localhost:3000/graphiql)

When you paste this on the left side of the page:

```
{
  testString
}
```

and hit the play button (cmd-return), then you should get this on the right side:

```json
{
  "data": {
    "testString": "It works!"
  }
}
```
