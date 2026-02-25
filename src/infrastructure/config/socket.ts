import { Server } from "socket.io";
import { Server as HttpServer } from "http";
const CLIENT_URL = process.env.FRONTEND_URL

export const createSocketServer = (httpServer: HttpServer)=>{
    const io = new Server(httpServer,{
        cors:{
            origin: [
                'http://localhost:5173',
                'https://beatbay.online'
            ],
            credentials: true
        }
    })

    return io;
}