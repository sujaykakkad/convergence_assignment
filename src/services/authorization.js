const jwt = require('jsonwebtoken');
const { token, mongo } = require('../config');
const dbStore = require('../lib/db');

module.exports = async (req, res, next) => {
  const errorStatus = 401;
  let isAuthenticated = false;
  if (req.headers.authorization) {
    try {
      const authToken = req.headers.authorization;
      const decoded = jwt.verify(authToken.split('Bearer ')[1], token.secret);
      const blackListedToken = await dbStore.mongoConn.db(mongo.db).collection('token_blacklist').findOne({ token_id: decoded.jti });
      if (!blackListedToken) {
        req.token = decoded;
        isAuthenticated = true;
      } else {
        req.log.info(`Token is blacklisted with id: ${decoded.jti}`);
      }
    } catch (err) {
      req.log.error(err);
    }
  }
  if (!isAuthenticated) {
    res.status(errorStatus);
    res.send({
      error: { message: 'Authorization Failed' },
    });
  } else {
    next();
  }
};
