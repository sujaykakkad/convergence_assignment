/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { mongo, token } = require('../config');
const dbStore = require('../lib/db');
const { bcryptCompareAsync } = require('../lib/util');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const db = dbStore.mongoConn.db(mongo.db);
  const user = await db.collection('users').findOne({ email });
  const errorResponse = {
    errors: [{ message: 'Invalid Email or Password' }],
  };
  const errorStatus = 401;
  if (!user) {
    res.status(errorStatus);
    return errorResponse;
  }
  const compare = await bcryptCompareAsync(password, user.password);
  if (!compare) {
    res.status(errorStatus);
    return errorResponse;
  }
  const userObj = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  const signedToken = jwt.sign({ user: userObj }, token.secret,
    { expiresIn: token.expiry, jwtid: uuidv4() });
  return {
    data: {
      user: userObj,
      token: signedToken,
    },
  };
};
exports.getPublicResources = async (req, res) => {
  const db = dbStore.mongoConn.db(mongo.db);
  const cursor = db.collection('resources').find({ type: 'public' });
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

exports.getAdminResources = async (req, res) => {
  const db = dbStore.mongoConn.db(mongo.db);
  const cursor = db.collection('resources').find({ type: { $in: ['admin', 'private'] } });
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
