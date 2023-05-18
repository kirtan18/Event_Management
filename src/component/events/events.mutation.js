const graphql = require('graphql');

const {
  GraphQLList, GraphQLInt, GraphQLString
} = graphql;
const { EventType } = require('./events.types');
const { dbConnPool } = require('../../../config/db.config');
const { createEventSchema, updateEventSchema, deleteEventSchema } = require('./events.validation');

const { currentDate } = require('../../constant/constantVariables');
const eventsDal = require('./events.dal');

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
      const dbClient = await dbConnPool.connect();
      try {
        const validateValues = { ...args };
        const { error } = createEventSchema.validate(validateValues);
        if (error) {
          console.info(error.details[0].message);
          throw new Error(error.details[0].message);
        }
        const values = [args.title, args.description, args.location, args.startDate, args.endDate,
          args.createdBy, args.createdAt
        ];
        const repsonse = eventsDal.createEventDal(dbClient, values);
        return repsonse;
      } finally {
        dbClient.release();
      }
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
      const dbClient = await dbConnPool.connect();
      try {
        const validateValues = { ...args };
        const { error } = updateEventSchema.validate(validateValues);
        if (error) {
          throw new Error(error.details[0].message);
        }
        args.updatedAt = currentDate;
        const columns = Object.keys(args).filter(key => key !== 'id');
        const values = columns.map(item => args[item]);
        const parameters = [...values, args.id];

        const response = eventsDal.updateEventDal(dbClient, columns, parameters);
        return response;
      } finally {
        dbClient.release();
      }
    }
  },

  deleteEvent: {
    type: new GraphQLList(EventType),
    args: {
      id: { type: GraphQLInt },
    },
    resolve: async (parentValue, args) => {
      const dbClient = await dbConnPool.connect();
      try {
        const { id } = args;
        const { error } = deleteEventSchema.validate({ id });
        if (error) {
          throw new Error(error.details[0].message);
        }
        const values = [id];
        const response = eventsDal.deleteEventDal(dbClient, values);
        return response;
      } finally {
        dbClient.release();
      }
    }
  }
};
