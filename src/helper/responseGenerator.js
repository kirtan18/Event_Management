const errorCodes = require('../constant/errorConst');

const generateErrorResponse = (error) => errorCodes[error.message]
    || errorCodes.INTERNAL_SERVER_ERROR;

const getErrorResponse = (error) => {
  console.error(error);
  return generateErrorResponse(error);
};

module.exports = {
  getErrorResponse
};
