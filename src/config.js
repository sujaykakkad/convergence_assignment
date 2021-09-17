require('dotenv').config();

module.exports = {
  appInfo: {
    prefix: process.env.PREFIX || 'convergence',
    port: parseInt(process.env.PORT, 10) || 3000,
    url: process.env.applicationURL || 'https://127.0.0.1:3000',
  },
  mongo: {
    host: process.env.MONGO_HOST || 'mongo',
    port: parseInt(process.env.MONGO_PORT, 10) || 27017,
    db: process.env.MONGO_DB || 'convergence',
  },
  token: {
    secret: process.env.JWT_TOKEN_SECRET,
    expiry: process.env.JWT_TOKEN_EXPIRY || '1d',
  },
};
