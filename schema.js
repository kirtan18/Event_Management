const graphql = require('graphql');

const { GraphQLSchema, GraphQLObjectType } = graphql;
const { getEvents, getEventById, getEventsByLocationOrDate } = require('./src/component/events/events.query');
const { createEvent, updateEvent, deleteEvent } = require('./src/component/events/events.mutation');

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

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});
