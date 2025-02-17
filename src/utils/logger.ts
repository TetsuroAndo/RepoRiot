import winston from 'winston';
import { env } from '../config/env';
import { promises as fs } from 'fs';

// Stream interface for Morgan middleware
interface LoggerStream {
  write(message: string): void;
}

// Ensure logs directory exists
fs.mkdir('logs', { recursive: true }).catch(console.error);

const { combine, timestamp, printf, colorize, json } = winston.format;

// Custom format for development
const devFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

const logger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp(),
    env.NODE_ENV === 'production' ? json() : devFormat
  ),
  transports: [
    // Always write to console
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp(),
        devFormat
      )
    }),
    
    // Write all errors to error.log
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),

    // Write all logs to combined.log
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
});

// Add stream support for Morgan middleware if needed
(logger as any).stream = {
  write: (message: string) => {
    logger.info(message.trim());
  }
} as LoggerStream;

if (env.NODE_ENV !== 'production') {
  logger.debug('Logger initialized in development mode');
} else {
  logger.info('Logger initialized in production mode');
}

export { logger };

export default logger;
