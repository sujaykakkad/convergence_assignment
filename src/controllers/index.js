const authorizationService = require('../services/authorization');
const {
  login,
  logout,
} = require('../services');

module.exports = async (router) => {
  const loginSchema = {
    body: {
      type: 'object',
      required: [
        'email',
        'password',
      ],
      properties: {
        email: { type: 'string', minLength: 1 },
        password: { type: 'string', minLength: 8 },
      },
    },
  };

  router.post('/login', { schema: loginSchema }, login);
  router.post('/logout', { onRequest: [authorizationService] }, logout);
};
