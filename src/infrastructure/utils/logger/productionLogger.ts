import path from "path";
import winston from "winston"
const {combine, timestamp, json } = winston.format

const ProductionLogPath = path.join(__dirname, "logs/production.log")
const errorLogPath = path.join(__dirname, "logs/error.log")

const ProductionLogger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(), json()),
    transports:[
      new winston.transports.File({filename: ProductionLogPath, level:"info"}),
      new winston.transports.File({filename: errorLogPath, level: "error"}),
      new winston.transports.Console({level:"info", format: json()})
    ],
})

export default ProductionLogger