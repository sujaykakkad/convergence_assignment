/* eslint-disable global-require */
module.exports = async (router) => {
  router.register(require('./controllers'));
};
