const fastify = require('fastify')({ logger: true });

fastify.get('/', async () => {
  const a = undefined;
  a.b = 1;
  return { hello: 'world' };
});

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
  fastify.log.debug(`Process ${process.pid} received a SIGTERM signal`);
  process.exit(1);
});

process.on('SIGINT', () => {
  fastify.log.debug(`Process ${process.pid} has been interrupted`);
  process.exit(1);
});

process.on('exit', (code) => {
  fastify.log(`Process exited with code: ${code}`);
});
