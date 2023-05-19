const { withFilter } = require('graphql-subscriptions');
const PubSub = require('PubSub');
const { EventType } = require('./events.types');

const pubsub = new PubSub();

module.exports = {
  eventUpdated: {
    type: EventType,
    subscribe: withFilter(
      () => pubsub.asyncIterator('EVENT_UPDATED'),
      (payload, variables) => payload.eventId === variables.eventId
    ),
    resolve: (payload) => payload,
  },
  eventCreated: {
    type: EventType,
    subscribe: () => pubsub.asyncIterator('EVENT_CREATED'),
  },
  resolve: (payload) => payload,
};

function publishEventUpdated(event) {
  pubsub.publish('EVENT_UPDATED', { eventUpdated: event });
}

function publishEventCreated(event) {
  pubsub.publish('EVENT_CREATED', { eventCreated: event });
}

module.exports.publishEventUpdated = publishEventUpdated;
module.exports.publishEventCreated = publishEventCreated;
