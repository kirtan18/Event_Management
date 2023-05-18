const graphql = require('graphql');

const { GraphQLSchema, GraphQLObjectType } = graphql;
const { getEvents, getEventById, getEventsByLocationOrDate } = require('./events/events.query');
const { createEvent, updateEvent, deleteEvent } = require('./events/events.mutation');

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
