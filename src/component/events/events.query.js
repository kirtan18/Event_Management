const graphql = require('graphql');

const { GraphQLList, GraphQLInt, GraphQLString } = graphql;
const { EventType } = require('./events.types');
const { dbConnPool } = require('../../../config/db.config');
const { getEventsSchema, getEventByIdSchema, getEventsByLocationOrDateSchema } = require('./events.validation');
const eventsDal = require('./events.dal');

const getValues = (args) => {
  let values;
  if (args.date && args.location) {
    values = [args.date, args.location];
  } else if (args.location) {
    values = [args.location];
  } else if (args.date) {
    values = [args.date];
  }
  return values;
};

module.exports = {
  getEvents: {
    type: new GraphQLList(EventType),
    args: {
      sortBy: { type: GraphQLString },
      orderBy: { type: GraphQLString },
      limit: { type: GraphQLInt },
      offSet: { type: GraphQLInt }
    },
    resolve: async (parentValue, args) => {
      const dbClient = await dbConnPool.connect();
      try {
        const {
          sortBy, orderBy, limit, offSet
        } = args;
        const { error } = getEventsSchema.validate({
          sortBy, orderBy, limit, offSet
        });
        if (error) {
          throw new Error(error.details[0].message);
        }
        const repsonse = eventsDal.getEventsDal(dbClient, sortBy, orderBy, limit, offSet);
        return repsonse;
      } finally {
        dbClient.release();
      }
    },
  },

  getEventById: {
    type: new GraphQLList(EventType),
    args: {
      id: { type: GraphQLInt }
    },
    resolve: async (parentValue, args) => {
      const dbClient = await dbConnPool.connect();
      try {
        const { id } = args;
        const { error } = getEventByIdSchema.validate({ id });
        if (error) {
          throw new Error(error.details[0].message);
        }
        const values = [id];
        const repsonse = eventsDal.getEventByIdDal(dbClient, values);
        return repsonse;
      } finally {
        dbClient.release();
      }
    },
  },

  getEventsByLocationOrDate: {
    type: new GraphQLList(EventType),
    args: {
      date: { type: GraphQLString },
      location: { type: GraphQLString }
    },
    resolve: async (parentValue, args) => {
      const dbClient = await dbConnPool.connect();
      try {
        const { date, location } = args;
        const { error } = getEventsByLocationOrDateSchema.validate({ date, location });
        if (error) {
          throw new Error(error.details[0].message);
        }
        const values = getValues(args);
        const response = eventsDal.getEventsByLocationOrDateDal(dbClient, args, values);
        return response;
      } finally {
        dbClient.release();
      }
    },
  }
};
