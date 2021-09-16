require('dotenv').config();

module.exports = {
  appInfo: {
    prefix: process.env.prefix || 'convergence',
    port: parseInt(process.env.port, 10) || 3000,
    url: process.env.applicationURL || 'https://127.0.0.1:3000',
  },
};
