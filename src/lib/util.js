const bcrypt = require('bcryptjs');
const { promisify } = require('util');

exports.bcryptGenSaltAsync = promisify(bcrypt.genSalt);
exports.bcryptHashAsync = promisify(bcrypt.hash);
exports.bcryptCompareAsync = promisify(bcrypt.compare);