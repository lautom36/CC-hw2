const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize} = format;

const myFormat = printf(({ level, message, timestamp}) => {
  return `${timestamp} [${level}] ${message}`;
});

const consumerLogger = () => {
  return createLogger({
    level: 'debug',
    format: combine(
      // colorize(),
      timestamp({ format: "HH:mm:ss"}),
      myFormat
    ),
    transports: [
      new transports.File({ filename: 'consumer.log' }),
      // new transports.Console()
    ]
  });
}

module.exports = consumerLogger;