import {Server, Socket } from "socket.io"
import { PrivateRoomHandler } from "./privateRoom.handler"
import { SocketCacheService } from "../cache/jam-cache/jam-cache.service"
import logger from "../utils/logger/logger"

export const registerSocketHandler = (io: Server)=>{

    const cacheService = new SocketCacheService()
    const handler = new PrivateRoomHandler(cacheService)

    io.on("connection", (socket:Socket)=>{
        logger.info(`connection started ${socket.id}`)
        handler.privateRoom(io, socket)
    })
}