const { MongoClient } = require('mongodb');
const { mongo } = require('../config');
const populateData = require('./populateData');

class DBStore {
  async initializeDB() {
    const url = `mongodb://${mongo.host}:${mongo.port}`;
    const mongoConn = new MongoClient(url);
    this.mongoConn = mongoConn;
    await mongoConn.connect();
    await populateData(mongoConn);
  }
}

module.exports = new DBStore();
