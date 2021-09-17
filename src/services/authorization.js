const jwt = require('jsonwebtoken');
const { token } = require('../config');

module.exports = (req, res, next) => {
  const errorStatus = 401;
  const isAuthenticated = false;
  if (req.headers.authorization) {
    try {
      const authToken = req.headers.authorization;
      const decoded = jwt.verify(authToken.split('Bearer ')[1], token.secret);
      req.token = decoded;
    } catch (err) {
      req.log.error(err);
    }
  }
  if (!isAuthenticated) {
    res.status(errorStatus);
    res.send({
      errors: [{ message: 'Authorization Failed' }],
    });
  } else {
    next();
  }
};
