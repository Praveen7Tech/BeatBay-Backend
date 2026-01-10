import path from "path";
import winston  from "winston"
import "winston-daily-rotate-file";
const {combine, timestamp, json, colorize, simple } = winston.format

const loggFilePath = path.join(__dirname, "logs")

const Devlogger = winston.createLogger({
  level: 'debug',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), simple())
    }),
    
    new winston.transports.DailyRotateFile({
      dirname: loggFilePath,
      filename: 'dev-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false, 
      maxSize: '10m',       //  Rotate if file hits 10MB
      maxFiles: '1d',       // RETENTION: Automatically delete logs older than 7 days
      format: simple()      // Keep it simple/readable for dev files
    }),
  ],
});


export default Devlogger

