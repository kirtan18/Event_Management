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
  /**
 * @swagger
 * /graphql/getEvents:
 *   post:
 *     tags:
 *       - Events
 *     summary: To return all existing events
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         required: true
 *         type: string
 *         enum: [eventId, title, location, startDate]
 *       - in: query
 *         name: orderBy
 *         required: true
 *         type: string
 *         enum:
 *         - ASC
 *         - DESC
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: offSet
 *         required: true
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: successful operation.
 *         schema:
 *           $ref: 'components/events/res.json#getEvents'
 *       400:
 *         description: Bad Request - validation error
 *         schema:
 *           $ref: 'components/errorContracts.json#ValidationErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ErrorResponse'
 */
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

  /**
 * @swagger
 * /graphql/getEventById:
 *   post:
 *     tags:
 *       - Events
 *     summary: To return Event by Id
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: Id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 49
 *     responses:
 *       200:
 *         description: successful operation.
 *         schema:
 *           $ref: 'components/events/res.json#getEventByID'
 *       400:
 *         description: Bad Request - validation error
 *         schema:
 *           $ref: 'components/errorContracts.json#ValidationErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ErrorResponse'
 */
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
      } catch (error) {
        throw new Error(error);
      } finally {
        dbClient.release();
      }
    },
  },

  /**
 * @swagger
 * /graphql/getEventsByLocationOrDate:
 *   post:
 *     tags:
 *       - Events
 *     summary: To return Event by Location or Date
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           example: "2023-05-12"
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *           example: ahmedabad
 *     responses:
 *       200:
 *         description: successful operation.
 *         schema:
 *           $ref: 'components/events/res.json#getEventsByLocationOrDate'
 *       400:
 *         description: Bad Request - validation error
 *         schema:
 *           $ref: 'components/errorContracts.json#ValidationErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ErrorResponse'
 */
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
