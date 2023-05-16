const express = require('express');
const logger = require('morgan');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const schema = require('./schema');

const app = express();
const { serverPort } = require('./config/index');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  '/graphql',
  expressGraphQL({
    schema,
    graphiql: true,
  })
);

app.listen(serverPort, () => console.info(`GraphQL server running on localhost:${serverPort}`));
