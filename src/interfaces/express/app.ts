import expres, { ErrorRequestHandler, urlencoded } from "express"
import cors from "cors"
import { scopePerRequest } from "awilix-express"
import container from "../../infrastructure/di/container"
import logger from "../../infrastructure/utils/logger/logger"
import { StatusCode } from "../../common/status.enum"
import { MESSAGES } from "../../common/constants.message"
import cookieParser from "cookie-parser"

const app = expres()

app.use(expres.json())
app.use(urlencoded({extended: true}))
app.use(cookieParser())
app.use(
    cors({
        origin:"http://localhost:5173",
        credentials:true,
        methods: ['GET','POST','PUT','DELETE','OPTIONS']
    })
);

// middlewre for dependency injection
app.use(scopePerRequest(container))

// Error handling MD
const errorHandler: ErrorRequestHandler = (err, req, res, next)=> {
    logger.error("API Error", err)

    const status = err.status || StatusCode.INTERNAL_SERVER_ERROR
    const message = err.message || MESSAGES.UNEXPECTED_ERROR

    res.status(status).json({message})
}

app.use(errorHandler)

// Prevent browser from caching sensitive pages
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store'); 
  res.setHeader('Pragma', 'no-cache');        
  res.setHeader('Expires', '0');              
  next();
});



export default app;