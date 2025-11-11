import path from "path";
import winston  from "winston"
const {combine, timestamp, json, colorize, simple } = winston.format

const loggFilePath = path.join(__dirname, "logs/devlogs.log")

const Devlogger = winston.createLogger({
  level: 'debug',
  format: combine(
    timestamp(), json(), simple()),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), simple())
    }),
    new winston.transports.File({ filename: loggFilePath }),
  ],
});

export default Devlogger

