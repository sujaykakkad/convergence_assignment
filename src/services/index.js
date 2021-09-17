/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { mongo, token, collectionNames } = require('../config');
const dbStore = require('../lib/db');
const { bcryptCompareAsync } = require('../lib/util');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const db = dbStore.mongoConn.db(mongo.db);
  const user = await db.collection(collectionNames.users).findOne({ email });
  const errorResponse = {
    error: { message: 'Invalid Email or Password' },
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
    { expiresIn: token.expiryInMillis, jwtid: uuidv4() });
  return {
    data: {
      user: userObj,
      token: signedToken,
    },
  };
};

exports.logout = async (req) => {
  const { token: tokenObj } = req;
  const db = dbStore.mongoConn.db(mongo.db);
  await db.collection(collectionNames.tokenBlackList).insertOne({
    token_id: tokenObj.jti,
    issued_date: moment.unix(tokenObj.iat).toDate(),
  });
  return {
    data: {
      message: 'Logout Successful',
    },
  };
};
