const graphql = require('graphql');

const {
  GraphQLList, GraphQLInt, GraphQLString
} = graphql;
const { EventType } = require('./events.types');
const { dbConnPool } = require('../../../config/db.config');
const { createEventSchema, updateEventSchema, deleteEventSchema } = require('./events.validation');

const { currentDate } = require('../../constant/constantVariables');
const eventsDal = require('./events.dal');
const { publishEventCreated, publishEventUpdated } = require('./events.subscription');

module.exports = {
  /**
 * @swagger
 * /graphql/createEvent:
 *   post:
 *     tags:
 *       - Events
 *     summary: Generate New Event
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *           example: Javascript
 *       - in: query
 *         name: description
 *         required: true
 *         schema:
 *           type: string
 *           example: AMERICAFIRST FUND
 *       - in: query
 *         name: location
 *         required: true
 *         schema:
 *           type: string
 *           example: Ahmedabad
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           example: 2023-05-24
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           example: 2023-05-30
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           example: 2023-05-30
 *       - in: query
 *         name: createdBy
 *         required: true
 *         schema:
 *           type: string
 *           example: Hulk
 *       - in: query
 *         name: createdAt
 *         required: true
 *         schema:
 *           type: string
 *           example: 2023-05-27
 *     responses:
 *       200:
 *         description: successful operation.
 *         schema:
 *           $ref: 'components/events/res.json#createEvent'
 *       400:
 *         description: Bad Request - validation error
 *         schema:
 *           $ref: 'components/errorContracts.json#ValidationErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ErrorResponse'
 */
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
        const response = await eventsDal.createEventDal(dbClient, values);
        const createdEvent = response;
        publishEventCreated(createdEvent);
        return response;
      } finally {
        dbClient.release();
      }
    }
  },

  /**
 * @swagger
 * /graphql/updateEvent:
 *   post:
 *     tags:
 *       - Events
 *     summary: update Event
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *           example: Javascript
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *           example: AMERICAFIRST FUND
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *           example: Ahmedabad
 *       - in: query
 *         name: updatedBy
 *         schema:
 *           type: string
 *           example: Captain America
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: ineteger
 *           example: 19
 *     responses:
 *       200:
 *         description: successful operation.
 *         schema:
 *           $ref: 'components/events/res.json#updateEvent'
 *       400:
 *         description: Bad Request - validation error
 *         schema:
 *           $ref: 'components/errorContracts.json#ValidationErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ErrorResponse'
 */
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
        // eslint-disable-next-line no-param-reassign
        args.updatedAt = currentDate;
        const columns = Object.keys(args).filter(key => key !== 'id');
        const values = columns.map(item => args[item]);
        const parameters = [...values, args.id];

        const response = await eventsDal.updateEventDal(dbClient, columns, parameters);
        const updatedEvent = response;
        publishEventUpdated(updatedEvent);
        return response;
      } finally {
        dbClient.release();
      }
    }
  },

  /**
 * @swagger
 * /graphql/deleteEvent:
 *   post:
 *     tags:
 *       - Events
 *     summary: Delete Event
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 29
 *     responses:
 *       200:
 *         description: successful operation.
 *         schema:
 *           $ref: 'components/events/res.json#deleteEvent'
 *       400:
 *         description: Bad Request - validation error
 *         schema:
 *           $ref: 'components/errorContracts.json#ValidationErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         schema:
 *           $ref: 'components/errorContracts.json#/ErrorResponse'
 */
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
        const response = await eventsDal.deleteEventDal(dbClient, values);
        return response;
      } finally {
        dbClient.release();
      }
    }
  }
};
