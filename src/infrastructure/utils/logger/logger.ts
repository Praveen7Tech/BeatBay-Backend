import Devlogger from "./DevLogger";
import ProductionLogger from "./productionLogger";

const isProduction = process.env.NODE_ENV === "production"

const logger = isProduction ? ProductionLogger : Devlogger

export default logger;