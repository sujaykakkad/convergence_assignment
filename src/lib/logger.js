const { mkdirSync, existsSync } = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');
const pino = require('pino');

class Logger {
  initializeLogger() {
    const logDir = path.join(path.dirname(path.dirname(__dirname)), 'logs');
    const logFileName = 'logs.json';

    if (!existsSync(logDir)) {
      mkdirSync(logDir);
    }
    const logStream = rfs.createStream((time, index) => {
      const pad = (num) => (num > 9 ? '' : '0') + num;
      if (!time) return logFileName;

      const year = time.getFullYear();
      const month = pad(time.getMonth() + 1);
      const day = pad(time.getDate());
      const hour = pad(time.getHours());
      const minute = pad(time.getMinutes());

      return `${year}-${month}-${day}_${hour}:${minute}-${index}-${logFileName}.gz`;
    }, {
      size: '10M',
      maxFiles: 100,
      interval: '1d',
      compress: 'gzip',
      path: logDir,
      teeToStdout: true,
    });

    this.logger = pino(
      {
        redact: ['req.headers.authorization'],
        level: 'info',
      },
      logStream,
    );
  }
}

module.exports = new Logger();
