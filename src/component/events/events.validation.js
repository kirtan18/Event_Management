const Joi = require('joi');

module.exports = {
  getEventsSchema: Joi.object({
    limit: Joi.number().integer().required(),
    offSet: Joi.number().integer().required()
  }),
  getEventByIdSchema: Joi.object({
    id: Joi.number().integer().required()
  }),
  getEventsByLocationOrDateSchema: Joi.object({
    date: Joi.string(),
    location: Joi.string(),
  }),
  createEventSchema: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
    createdBy: Joi.string().required(),
    createdAt: Joi.string().required(),
  }),
  updateEventSchema: Joi.object({
    title: Joi.string(),
    description: Joi.string(),
    location: Joi.string(),
    updatedBy: Joi.string().required(),
    id: Joi.number().integer().required()
  }),
  deleteEventSchema: Joi.object({
    id: Joi.number().integer().required()
  }),
};
