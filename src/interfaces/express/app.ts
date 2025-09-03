import expres, { urlencoded } from "express"
import cors from "cors"
import authRouter from "../http/routes/auth.routes"

const app = expres()

app.use(expres.json())
app.use(urlencoded({extended: true}))
app.use(
    cors({
        origin:"http://localhost:5173",
        //credentials:true
    })
);

// Routes
app.use("/user", authRouter)

export default app;