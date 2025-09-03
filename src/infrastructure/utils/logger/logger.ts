import path from "path";
import winston from "winston"
const {combine, timestamp, json } = winston.format

const loggFilePath = path.join(__dirname, "devlogs.log")

const logger = winston.createLogger({
  level: 'debug',
  format: combine(
    timestamp(), json()),
  transports: [
    new winston.transports.File({ filename: loggFilePath }),
  ],
});

export default logger