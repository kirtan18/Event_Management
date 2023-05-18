const jwt = require('jsonwebtoken');

const { accessTokenSecret } = require('../../config/env.config');

module.exports = {
  auth: (req, res, next) => {
    const token = req.headers.authorization;
    try {
      if (!token) {
        throw new Error('FORBIDDEN');
      }
      jwt.verify(token, accessTokenSecret, (err, decoded) => {
        if (err) {
          throw new Error('UNAUTHORIZED');
        }
        req.user = decoded;
        next();
      });
    } catch (error) {
      next(error);
    }
  }
};
