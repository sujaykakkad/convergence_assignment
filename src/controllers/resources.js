const { authorizationMiddleware } = require('../lib/util');
const {
  getPublicResources,
  getAdminResources,
  getPrivateResources,
  getPrivateResource,
  deletePrivateResource,
  createPrivateResource,
  updatePrivateResource,
} = require('../services/resources');

module.exports = async (router) => {
  const resourceSchema = {
    body: {
      type: 'object',
      required: [
        'name',
      ],
      properties: {
        name: { type: 'string', minLength: 1 },
      },
    },
  };
  router.get('/resources/public/all', getPublicResources);
  router.get('/resources/only-admin/all', { onRequest: [...authorizationMiddleware('admin')] },
    getAdminResources);
  router.get('/resources/private/all', { onRequest: [...authorizationMiddleware('private')] },
    getPrivateResources);
  router.get('resources/private/:resourceId',
    { onRequest: [...authorizationMiddleware('private')] },
    getPrivateResource);
  router.post(
    'resources/private',
    { onRequest: [...authorizationMiddleware('private')], schema: resourceSchema },
    createPrivateResource,
  );
  router.put(
    'resources/private/:resourceId',
    { onRequest: [...authorizationMiddleware('private')], schema: resourceSchema },
    updatePrivateResource,
  );
  router.delete(
    'resources/private/:resourceId',
    { onRequest: [...authorizationMiddleware('private')] },
    deletePrivateResource,
  );
};
