const { appInfo } = require('./config');
const Logger = require('./lib/logger');
const dbStore = require('./lib/db');

Logger.initializeLogger();
// eslint-disable-next-line import/order
const fastify = require('fastify')({
  logger: Logger.logger, maxParamLength: 200,
});

fastify.setErrorHandler(async (err, _, res) => {
  let responseBody;
  fastify.log.error(err);
  if (err.validation) {
    res.status(400);
    responseBody = {
      error: { message: err.message },
    };
  } else {
    res.status(500);
    responseBody = {
      error: { message: 'Some Internal Error Occurred' },
    };
  }
  res.send(responseBody);
});

fastify.register(require('./router'), { prefix: `/${appInfo.prefix}/v1/` });

const start = async () => {
  try {
    fastify.log.info('Started');
    const address = await fastify.listen(3000, '0.0.0.0');
    await dbStore.initializeDB();
    fastify.log.info('Server Running on: ', address);
  } catch (err) {
    fastify.log.error(err);
    setTimeout(() => process.exit(1), 100);
  }
};
start();

process.on('SIGTERM', () => {
  fastify.log.error(`Process ${process.pid} received a SIGTERM signal`);
  // TODO: Handle some cleanup
  setTimeout(() => process.exit(1), 100);
});

process.on('SIGINT', () => {
  fastify.log.error(`Process ${process.pid} has been interrupted`);
  // TODO: Handle some cleanup
  setTimeout(() => process.exit(1), 100);
});

process.on('exit', (code) => {
  // eslint-disable-next-line no-console
  console.error(`Process exited with code: ${code}`);
});
