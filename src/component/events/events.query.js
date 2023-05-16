const graphql = require('graphql');

const { GraphQLList, GraphQLInt, GraphQLString } = graphql;
const { EventType } = require('./events.types');
const { pool } = require('../../../config/db.config');
const { getEventsSchema, getEventByIdSchema, getEventsByLocationOrDateSchema } = require('./events.validation');

module.exports = {
  getEvents: {
    type: new GraphQLList(EventType),
    args: {
      limit: { type: GraphQLInt },
      offSet: { type: GraphQLInt }
    },
    resolve: async (parentValue, args) => {
      const { limit, offSet } = args;
      const { error } = getEventsSchema.validate({ limit, offSet });
      if (error) {
        console.info(error.details);
        throw new Error(error.details[0].message);
      }
      const sqlQuery = 'SELECT * FROM events LIMIT $1 OFFSET $2';
      const values = [limit, offSet];
      const result = await pool.query(sqlQuery, values);
      return result.rows;
    },
  },

  getEventById: {
    type: new GraphQLList(EventType),
    args: {
      id: { type: GraphQLInt }
    },
    resolve: async (parentValue, args) => {
      const { id } = args;
      const { error } = getEventByIdSchema.validate({ id });
      if (error) {
        throw new Error(error.details[0].message);
      }
      const sqlQuery = 'SELECT * FROM events WHERE "eventId" = $1';
      const values = [id];
      const result = await pool.query(sqlQuery, values);
      return result.rows;
    },
  },

  getEventsByLocationOrDate: {
    type: new GraphQLList(EventType),
    args: {
      date: { type: GraphQLString },
      location: { type: GraphQLString }
    },
    resolve: async (parentValue, args) => {
      const { date, location } = args;
      const { error } = getEventsByLocationOrDateSchema.validate({ date, location });
      if (error) {
        throw new Error(error.details[0].message);
      }

      let sqlQuery = 'SELECT * FROM events WHERE 1=1';

      if (args.date && args.location) {
        sqlQuery += ' AND ("startDate" <= $1 AND "endDate" >= $1) AND (location ILIKE $2)';
      } else if (args.date) {
        sqlQuery += ' AND ("startDate" <= $1 AND "endDate" >= $1)';
      } else if (args.location) {
        sqlQuery += ' AND location ILIKE $1';
      }

      // eslint-disable-next-line no-nested-ternary
      const values = args.date && args.location ? [args.date, args.location]
        : args.location ? [args.location] : [args.date];
      const result = await pool.query(sqlQuery, values);
      return result.rows;
    },
  }
};
