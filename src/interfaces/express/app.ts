import expres, { ErrorRequestHandler, urlencoded } from "express"
import cors from "cors"
import { scopePerRequest } from "awilix-express"
import container from "../../infrastructure/di/container"
import cookieParser from "cookie-parser"

const app = expres()

app.use(expres.json())
app.use(urlencoded({extended: true}))
app.use(cookieParser())
app.use(
    cors({
        origin:["http://localhost:5173"],
        credentials:true,
        methods: ['GET','POST','PUT','DELETE','OPTIONS']
    })
);

// middlewre for dependency injection
app.use(scopePerRequest(container))




// Prevent browser from caching sensitive pages
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store'); 
  res.setHeader('Pragma', 'no-cache');        
  res.setHeader('Expires', '0');              
  next();
});



export default app;