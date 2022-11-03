const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  // if the origins is allowed, and go ahead and set the response to the cors what they want
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Credential', true)
  }
  next();
}

module.exports = credentials;