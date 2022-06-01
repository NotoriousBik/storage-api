
const { APIError } = require('./error');
const { Logger } = require('../logger');

const logger = new Logger();

function errorMiddleware(err, req, res, next) {
  if (err instanceof APIError) {
    logger.log(err);
    return res.status(err.httpCode).json({ message: err.name })
  }
  logger.log(err);
  return res.status(500).json({ message: "Internal server error" })
}

module.exports = { errorMiddleware };