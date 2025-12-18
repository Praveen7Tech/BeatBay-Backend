import { Server } from "socket.io";
import { Server as HttpServer } from "http";

export const createSocketServer = (httpServer: HttpServer)=>{
    const io = new Server(httpServer,{
        cors:{
            origin: 'http://localhost:5173',
            credentials: true
        }
    })

    return io;
}