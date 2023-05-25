const express = require('express');
const logger = require('morgan');
const { createServer } = require('http');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { schema } = require('./src/component/schema');
const responseGenerator = require('./src/helper/responseGenerator');

const app = express();
const { serverPort } = require('./config/env.config');
const { auth } = require('./src/middleware/auth');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/docs', express.static('docs/api'));

app.use(auth);

app.use(
  '/graphql',
  graphqlExpress({
    schema,
    graphiql: true,
  })
);

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:${serverPort}/subscriptions`,
    graphiql: true,
  })
);

app.use((err, request, response, next) => {
  const errorResponse = responseGenerator.getErrorResponse(err);
  response.status(errorResponse.httpStatusCode).send(errorResponse.body);
});

const server = createServer(app);
server.listen(serverPort, () => {
  // eslint-disable-next-line no-new
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
      onConnect: () => console.info('Client connected'),
    },
    {
      server,
      path: '/subscriptions',
    }
  );
  console.info(`GraphQL server running on localhost:${serverPort}`);
});
