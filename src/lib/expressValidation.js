const expressValidation = require('express-validation');

module.exports = {
  validate: (schema) => expressValidation.validate(
    schema,
    { context: true },
    { abortEarly: false }
  ),
  ValidationError: expressValidation.ValidationError,
};
