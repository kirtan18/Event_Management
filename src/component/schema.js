const graphql = require('graphql');

const { GraphQLSchema, GraphQLObjectType } = graphql;
const PubSub = require('PubSub');
const { getEvents, getEventById, getEventsByLocationOrDate } = require('./events/events.query');
const { createEvent, updateEvent, deleteEvent } = require('./events/events.mutation');
const { eventCreated, eventUpdated } = require('./events/events.subscription');

const pubsub = new PubSub();

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getEvents,
    getEventById,
    getEventsByLocationOrDate
  },
});

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createEvent,
    updateEvent,
    deleteEvent
  },
});

const RootSubscriptionType = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    eventCreated,
    eventUpdated
  }
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
  subscription: RootSubscriptionType
});

module.exports = {
  schema,
  pubsub
};
