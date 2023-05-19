const express = require('express');
const logger = require('morgan');
const { createServer } = require('http');
const expressGraphQL = require('express-graphql').graphqlHTTP;
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

app.use(auth);
app.use(
  '/graphql',
  expressGraphQL(req => ({
    schema,
    context: {
      user: req.user,
    },
    graphiql: true,
  }))
);

app.use((err, request, response, next) => {
  const errorResponse = responseGenerator.getErrorResponse(err);
  response.status(errorResponse.httpStatusCode).send(errorResponse.body);
});

const server = createServer(app);
server.listen(serverPort, () => {
  console.info(`GraphQL server running on localhost:${serverPort}`);

  // eslint-disable-next-line no-new
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema,
    },
    {
      server,
      path: '/subscriptions',
    }
  );
});
