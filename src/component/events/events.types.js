const graphql = require('graphql');

const {
  GraphQLObjectType, GraphQLString, GraphQLInt,
//   GraphQLScalarType
} = graphql;

// Define the custom scalar type for dates
// const GraphQLDate = new GraphQLScalarType({
//   name: 'GraphQLDate',
//   serialize: value => new Date(value).toISOString
// });

const EventType = new GraphQLObjectType({
  name: 'Event',
  fields: () => ({
    eventId: { type: GraphQLInt },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    location: { type: GraphQLString },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    createdBy: { type: GraphQLString },
    updatedBy: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  }),
});

module.exports = {
  EventType,
};
