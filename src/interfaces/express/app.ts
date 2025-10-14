import expres, { ErrorRequestHandler, urlencoded } from "express"
import cors from "cors"
import authRouter from "../http/routes/auth.routes"
import { scopePerRequest } from "awilix-express"
import container from "../../infrastructure/di/container"
import logger from "../../infrastructure/utils/logger/logger"
import { STATES } from "mongoose"
import { StatusCode } from "../../common/status.enum"
import { MESSAGES } from "../../common/constants.message"

const app = expres()

app.use(expres.json())
app.use(urlencoded({extended: true}))
app.use(
    cors({
        origin:"http://localhost:5173",
        //credentials:true
    })
);

// middlewre for dependency injection
app.use(scopePerRequest(container))

// Error handling MD
const errorHandler: ErrorRequestHandler = (err, req, res, next)=> {
    logger.error("API Error", err)
    console.log("error happend in api", err)

    const status = err.status || StatusCode.INTERNAL_SERVER_ERROR
    const message = err.message || MESSAGES.UNEXPECTED_ERROR

    res.status(status).json({message})
}

app.use(errorHandler)

export default app;