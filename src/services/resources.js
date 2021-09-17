/* eslint-disable no-underscore-dangle */
const { ObjectId } = require('bson');
const dbStore = require('../lib/db');
const { mongo, collectionNames } = require('../config');

const resourceSerializer = (resource) => ({
  id: resource._id || resource.id,
  name: resource.name,
  type: resource.type,
});

const getCollection = () => {
  const db = dbStore.mongoConn.db(mongo.db);
  return db.collection(collectionNames.resources);
};

exports.getPublicResources = async () => {
  const cursor = getCollection().find({ type: 'public' });
  const resources = await cursor.toArray();
  if (resources && resources.length) {
    return {
      data: resources.map(resourceSerializer),
    };
  }
  return {
    data: [],
  };
};

exports.getAdminResources = async () => {
  const cursor = getCollection().find({ type: { $in: ['admin', 'private'] } });
  const resources = await cursor.toArray();
  if (resources && resources.length) {
    return {
      data: resources.map(resourceSerializer),
    };
  }
  return {
    data: [],
  };
};

exports.getPrivateResources = async () => {
  const cursor = getCollection().find({ type: 'private' });
  const resources = await cursor.toArray();
  if (resources && resources.length) {
    return {
      data: resources.map(resourceSerializer),
    };
  }
  return {
    data: [],
  };
};

exports.getPrivateResource = async (req, res) => {
  const { resourceId } = req.params;
  const resouceObjectId = (() => {
    try {
      return ObjectId(resourceId);
    } catch (err) {
      req.log.error(err);
      return null;
    }
  })();
  if (resouceObjectId) {
    const resource = await getCollection().findOne({ _id: resouceObjectId, type: 'private' });
    if (resource) {
      return {
        data: resourceSerializer(resource),
      };
    }
  }
  res.status(404);
  return {
    error: { message: 'Resource not found' },
  };
};

exports.createPrivateResource = async (req) => {
  const insertObj = {
    name: req.body.name,
    type: 'private',
  };
  const resource = await getCollection().insertOne(insertObj);
  return {
    data: resourceSerializer({ id: resource.insertedId, ...insertObj }),
  };
};

exports.updatePrivateResource = async (req, res) => {
  const { resourceId } = req.params;
  const updateObj = {
    name: req.body.name,
  };
  const resouceObjectId = (() => {
    try {
      return ObjectId(resourceId);
    } catch (err) {
      req.log.error(err);
      return null;
    }
  })();
  if (resouceObjectId) {
    const resource = await getCollection().findOneAndUpdate(
      { _id: resouceObjectId, type: 'private' }, { $set: updateObj },
    );
    if (resource && resource.value) {
      return {
        data: resourceSerializer({ ...resource.value, ...updateObj }),
      };
    }
  }
  res.status(404);
  return {
    error: { message: 'Resource not found' },
  };
};

exports.deletePrivateResource = async (req, res) => {
  const { resourceId } = req.params;
  const resouceObjectId = (() => {
    try {
      return ObjectId(resourceId);
    } catch (err) {
      req.log.error(err);
      return null;
    }
  })();
  if (resouceObjectId) {
    const resource = await getCollection().findOneAndDelete({ _id: resouceObjectId, type: 'private' });
    if (resource && resource.value) {
      return {
        data: resourceSerializer(resource.value),
      };
    }
  }
  res.status(404);
  return {
    error: { message: 'Resource not found' },
  };
};
