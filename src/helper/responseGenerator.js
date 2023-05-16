const { ValidationError } = require('../lib/expressValidation');
const errorCodes = require('../constant/errorConst');
const { PostgreDbErrorCode } = require('../constant/errorConst');

const generateErrorResponse = (error) => errorCodes[error.message]
    || errorCodes.INTERNAL_SERVER_ERROR;

const validationErrorResponse = (error) => {
  const errors = [];
  Object.keys(error.details).forEach((key) => {
    error.details[key].forEach((e) => {
      errors.push({
        location: key,
        messages: e.message,
        field: e.path[0],
      });
    });
  });
  return {
    httpStatusCode: error.statusCode,
    body: {
      code: error.name,
      message: 'Request parameters are not valid',
      errors,
    },
  };
};

const getErrorResponse = (error) => {
  if (error instanceof ValidationError) {
    return validationErrorResponse(error);
  }
  if (error.code === PostgreDbErrorCode.FOREIGN_KEY_VIOLATION
      || error.code === PostgreDbErrorCode.UNIQUE_VIOLATION) {
    console.info(error);
    // eslint-disable-next-line no-param-reassign
    error = new Error('CONFLICT');
  }
  console.error(error);
  return generateErrorResponse(error);
};

module.exports = {
  getErrorResponse
};
