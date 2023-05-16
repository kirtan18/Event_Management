const graphql = require('graphql');

const {
  GraphQLList, GraphQLInt, GraphQLString
} = graphql;
const { EventType } = require('./events.types');
const { pool } = require('../../../config/db.config');
const { createEventSchema, updateEventSchema, deleteEventSchema } = require('./events.validation');
const updateQuery = require('../../helper/updateQuery.helper');

module.exports = {
  createEvent: {
    type: new GraphQLList(EventType),
    args: {
      title: { type: GraphQLString },
      description: { type: GraphQLString },
      location: { type: GraphQLString },
      startDate: { type: GraphQLString },
      endDate: { type: GraphQLString },
      createdBy: { type: GraphQLString },
      createdAt: { type: GraphQLString },
    },
    resolve: async (parentValue, args) => {
      const {
        title, description, location, startDate, endDate, createdBy, createdAt
      } = args;

      const { error } = createEventSchema.validate({
        title, description, location, startDate, endDate, createdBy, createdAt
      });
      if (error) {
        throw new Error(error.details[0].message);
      }

      const sqlQuery = `
                  INSERT INTO events(
                    title, description, location, "startDate", 
                    "endDate", "createdBy", "createdAt"
                  ) 
                  VALUES 
                    ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

      const paramters = [title, description, location, startDate, endDate, createdBy, createdAt];
      const result = await pool.query(sqlQuery, paramters);
      return result.rows;
    }
  },

  updateEvent: {
    type: new GraphQLList(EventType),
    args: {
      title: { type: GraphQLString },
      description: { type: GraphQLString },
      location: { type: GraphQLString },
      updatedBy: { type: GraphQLString },
      id: { type: GraphQLInt },
    },
    resolve: async (parentValue, args) => {
      const validateValues = { ...args };
      const { error } = updateEventSchema.validate(validateValues);
      if (error) {
        throw new Error(error.details[0].message);
      }
      // eslint-disable-next-line no-param-reassign
      args.updatedAt = new Date().toISOString().slice(0, 10);
      const columns = Object.keys(args).filter(key => key !== 'id');
      const values = columns.map(item => args[item]);
      const sqlQuery = `
                UPDATE 
                   events 
                SET 
                   ${updateQuery.updateQueryData(columns)} 
                WHERE 
                   "eventId" = $${columns.length + 1} RETURNING *`;

      const parameters = [...values, args.id];
      const result = await pool.query(sqlQuery, parameters);
      return result.rows;
    }
  },

  deleteEvent: {
    type: new GraphQLList(EventType),
    args: {
      id: { type: GraphQLInt },
    },
    resolve: async (parentValue, args) => {
      const { id } = args;
      const { error } = deleteEventSchema.validate({ id });
      if (error) {
        throw new Error(error.details[0].message);
      }

      const sqlQuery = `
                  DELETE FROM 
                     events 
                  WHERE 
                     "eventId" = $1 RETURNING "eventId"`;

      const parameter = [id];
      const result = await pool.query(sqlQuery, parameter);
      return result.rows;
    }
  }
};
