const { appInfo } = require('./config');
const Logger = require('./lib/logger');

Logger.initializeLogger();
// eslint-disable-next-line import/order
const fastify = require('fastify')({
  logger: Logger.logger, maxParamLength: 200,
});

fastify.setErrorHandler(async (err, _, res) => {
  let responseBody;
  if (err.validation) {
    responseBody = {
      data: {},
      errors: [{ message: err.message, trace: '' }],
    };
  } else {
    responseBody = {
      data: {},
      errors: [{ message: err.message, trace: err.stack }],
    };
    fastify.log.error(err);
  }
  res.send(responseBody);
});

fastify.register(require('./router'), { prefix: `/${appInfo.prefix}/v1/` });

const start = async () => {
  try {
    const address = await fastify.listen(3000, '0.0.0.0');
    fastify.log.debug('Server Running on: ', address);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

process.on('SIGTERM', () => {
  fastify.log.error(`Process ${process.pid} received a SIGTERM signal`);
  // TODO: Handle some cleanup
  process.exit(1);
});

process.on('SIGINT', () => {
  fastify.log.error(`Process ${process.pid} has been interrupted`);
  // TODO: Handle some cleanup
  process.exit(1);
});

process.on('exit', (code) => {
  fastify.log.error(`Process exited with code: ${code}`);
  // TODO: Handle some cleanup
});
