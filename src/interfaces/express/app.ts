import express, {  urlencoded } from "express"
import cors from "cors"
import { scopePerRequest } from "awilix-express"
import container from "../../infrastructure/di/container"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import path from "path"

const app = express()

app.use(express.json())
app.use(urlencoded({extended: true}))
app.use(cookieParser())
app.use(
    cors({
        origin:["http://localhost:5173"],
        credentials:true,
        methods: ['GET','POST','PUT','DELETE','OPTIONS']
    })
);

app.use("/uploads", express.static(path.join(__dirname, "../../../public/uploads")));

// monggose debuging
mongoose.set('debug', true);


// middlewre for dependency injection
app.use(scopePerRequest(container))


app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store'); 
  res.setHeader('Pragma', 'no-cache');        
  res.setHeader('Expires', '0');              
  next();
});



export default app;