import express, {  urlencoded } from "express"
import cors from "cors"
import { scopePerRequest } from "awilix-express"
import container from "../../infrastructure/di/container"
import cookieParser from "cookie-parser"
import path from "path"
import stripeWebhookRouter from "../../interfaces/http/routes/stripe/stripe.webhook.route"

const app = express()

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'health check succesfull' });
});

// stripe webhook route
app.use('/stripe', stripeWebhookRouter(container))

app.use(express.json())
app.use(urlencoded({extended: true}))
app.use(cookieParser())
app.use(
    cors({
        origin:[
          "https://beat-bay-client.vercel.app",
          "http://localhost:5173",
          "https://beatbay.online"
        ],
        credentials:true,
        methods: ['GET','POST','PUT','PATCH','OPTIONS','DELETE']
    })
);

app.use("/songs", express.static(path.join(__dirname, "../../../public/songs")));
app.use("/albums", express.static(path.join(__dirname, "../../../public/albums")))

// monggose debuging
//mongoose.set('debug', true);


// middlewre for dependency injection
app.use(scopePerRequest(container))


app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store'); 
  res.setHeader('Pragma', 'no-cache');        
  res.setHeader('Expires', '0');              
  next();
});



export default app;