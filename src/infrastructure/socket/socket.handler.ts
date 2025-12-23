import {Server, Socket } from "socket.io"
import { PrivateRoomHandler } from "./privateRoom.handler"
import { SocketCacheService } from "../cache/jam-cache/jam-cache.service"
import logger from "../utils/logger/logger"
import { MongooseUserRepository } from "../presistence/mongoose/repositories/mongoose.user.repository"
import { MutualFrindsStatus } from "../../usecases/user/friends/mutalFriendsStatus.UseCase"

export const registerSocketHandler = (io: Server)=>{

    const cacheService = new SocketCacheService()
    const _userRepository = new MongooseUserRepository()
    const _cacheRoomService = new SocketCacheService()
    const friendsactivity = new MutualFrindsStatus(_userRepository, _cacheRoomService)
    const handler = new PrivateRoomHandler(cacheService, friendsactivity)

    io.on("connection", (socket:Socket)=>{
        logger.info(`connection started ${socket.id}`)
        handler.privateRoom(io, socket)
    })
}