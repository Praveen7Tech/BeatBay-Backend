import path from "path";
import winston from "winston"
const {combine, timestamp, json } = winston.format

const logDir = path.join(process.cwd(), "logs")
const ProductionLogPath = path.join(logDir, "production.log")
const errorLogPath = path.join(logDir, "error.log")

const ProductionLogger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(), json()),
    transports:[
      new winston.transports.File({filename: ProductionLogPath, level:"infp"}),
      new winston.transports.File({filename: errorLogPath, level: "error"}),
      new winston.transports.Console({level:"info", format: json()})
    ],
})

export default ProductionLogger