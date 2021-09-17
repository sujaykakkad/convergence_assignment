const { mongo } = require('../config');

module.exports = async (mongoConn) => {
  const db = mongoConn.db(mongo.db);
  const resourcesCollection = db.collection('resources');
  const usersCollection = db.collection('users');
  await Promise.all([resourcesCollection.remove(), usersCollection.remove()]);
  await Promise.all([
    usersCollection.insertMany([
      {
        name: 'John',
        email: 'john@gmail.com',
        password: '$2a$10$.Je5MZkPYX5DaLWcUSU2VOjv0dyKWmCkhq9r78hJ/Q6IS2VcPZu6S',
        role: 'admin',
      },
      {
        name: 'Rebecca',
        email: 'rebecca@gmail.com',
        password: '$2a$10$5WDLeTSSP9BqXEvDdTg5BODL8/8jndZXI8ycZ1mYf7cZlPnSHXMp2',
        role: 'private',
      },
    ]),
    resourcesCollection.insertMany([
      { name: 'test1', type: 'admin' },
      { name: 'test2', type: 'private' },
      { name: 'test3', type: 'public' },
    ]),
  ]);
};
