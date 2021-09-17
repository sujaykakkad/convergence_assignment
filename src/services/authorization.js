const jwt = require('jsonwebtoken');
const { token, mongo, collectionNames } = require('../config');
const dbStore = require('../lib/db');

module.exports = async (req, res, next) => {
  let errorStatus = 401;
  let errorMessage = 'Authorization Failed';
  let isAuthorized = false;
  if (req.headers.authorization) {
    try {
      const authToken = req.headers.authorization;
      const decoded = jwt.verify(authToken.split('Bearer ')[1], token.secret);
      const blackListedToken = await dbStore.mongoConn.db(mongo.db)
        .collection(collectionNames.tokenBlackList).findOne({ token_id: decoded.jti });
      if (!blackListedToken) {
        const { role } = decoded.user;
        if (role === 'admin' || role === req.resourceAccess) {
          req.token = decoded;
          isAuthorized = true;
        } else {
          errorStatus = 403;
          errorMessage = 'Not Allowed to Access';
        }
      } else {
        req.log.info(`Token is blacklisted with id: ${decoded.jti}`);
      }
    } catch (err) {
      req.log.error(err);
    }
  }
  if (!isAuthorized) {
    res.status(errorStatus);
    res.send({
      error: { message: errorMessage },
    });
  } else {
    next();
  }
};
