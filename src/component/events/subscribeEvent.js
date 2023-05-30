const WebSocket = require('subscriptions-transport-ws/dist/client');
const { serverPort } = require('../../../config/env.config');

const wsClient = new WebSocket.SubscriptionClient(
  `ws://localhost:${serverPort}/subscriptions`,
  {
    reconnect: true,
  }
);

wsClient.subscribe({
  query: `
    subscription {
      eventCreated {
        eventId
        title
        description
      }
    }
  `,
  variables: {},
}, (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.info(result);
  }
});
