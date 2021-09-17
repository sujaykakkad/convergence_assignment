const dbStore = require('../lib/db');
const { mongo, collectionNames } = require('../config');

exports.getPublicResources = async () => {
  const db = dbStore.mongoConn.db(mongo.db);
  const cursor = db.collection(collectionNames.resources).find({ type: 'public' });
  const resources = await cursor.toArray();
  if (resources && resources.length) {
    return {
      data: resources,
    };
  }
  return {
    data: [],
  };
};

exports.getAdminResources = async () => {
  const db = dbStore.mongoConn.db(mongo.db);
  const cursor = db.collection(collectionNames.resources).find({ type: { $in: ['admin', 'private'] } });
  const resources = await cursor.toArray();
  if (resources && resources.length) {
    return {
      data: resources,
    };
  }
  return {
    data: [],
  };
};

exports.getPrivateResources = async () => {
  const db = dbStore.mongoConn.db(mongo.db);
  const cursor = db.collection(collectionNames.resources).find({ type: 'private' });
  const resources = await cursor.toArray();
  if (resources && resources.length) {
    return {
      data: resources,
    };
  }
  return {
    data: [],
  };
};

exports.generateReportHtmlToPdf = async (req) => {
  try {
    req.log.debug('In generateReportHTML');
    return {
      data: { message: 'Pdf generation initiated' },
    };
  } catch (e) {
    req.log.error(e);
    return {
      data: {},
      errros: [{ message: e.message, trace: '' }],
    };
  }
};
