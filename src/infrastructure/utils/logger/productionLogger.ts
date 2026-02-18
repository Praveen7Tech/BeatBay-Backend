import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file"; 

const { combine, timestamp, json } = winston.format;

const logDirectory = path.join(__dirname, "logs")

const ProductionLogger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  transports: [
    // info Logs with 14-day retention
    new DailyRotateFile({
      dirname: logDirectory,
      filename: "production-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "14d",
      level: "info",
      zippedArchive: true 
    }),
    // error Logs with 30-day retention
    new DailyRotateFile({
      dirname: logDirectory,
      filename: "error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxFiles: "30d",
      level: "error",
      zippedArchive: true
    }),
    new winston.transports.Console({ level: "info" })
  ]
});

export default ProductionLogger;
