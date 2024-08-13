const { createLogger, format, transports } = require('winston');
const path = require('path');

// Configuramos los niveles de log según la prioridad
const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colors: {
    fatal: 'red',
    error: 'red',
    warning: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue'
  }
};

// Formato para los logs
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
);

// Logger para el entorno de desarrollo
const developmentLogger = createLogger({
  levels: customLevels.levels,
  format: format.combine(
    format.colorize(),
    logFormat
  ),
  transports: [
    new transports.Console({ level: 'debug' })
  ]
});

// Logger para el entorno de producción
const productionLogger = createLogger({
  levels: customLevels.levels,
  format: logFormat,
  transports: [
    new transports.Console({ level: 'info' }),
    new transports.File({ filename: path.join(__dirname, '../logs/errors.log'), level: 'error' }),
  ]
});

// Exportamos el logger adecuado según el entorno
const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger;

logger.error('Test log for errors.log');
productionLogger.error('Manual test error -> errors.log');
console.log(`Running in ${process.env.NODE_ENV} mode`);

module.exports = logger;
