const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const authorizationService = require('../services/authorization');

exports.bcryptGenSaltAsync = promisify(bcrypt.genSalt);
exports.bcryptHashAsync = promisify(bcrypt.hash);
exports.bcryptCompareAsync = promisify(bcrypt.compare);

exports.authorizationMiddleware = (resourceAccess) => [
  async (req) => {
    req.resourceAccess = resourceAccess;
  },
  authorizationService,
];
