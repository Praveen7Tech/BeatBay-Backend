import { Server as SocketIoServer} from "socket.io"
import { Server as httpServer } from "http";
import logger from "../utils/logger/logger";

export class SocketConfig{
    private static io: SocketIoServer;

    private static userSocket = new Map<string, string>

    public static init(server: httpServer){
        this.io = new SocketIoServer(server, {
            cors:{
                origin: 'http://localhost:5173',
                credentials: true,
                methods:['GET', 'POST']
            }
        })

        this.io.on("connection", (socket)=>{
            logger.info(`Socket connected successfully: ${socket.id}`)

            //link user to socket 
            socket.on("register_user", (userId: string)=>{
                this.userSocket.set(userId, socket.id)
                logger.info(`user ${userId} registered success`)
            })

            //send invitation
            socket.on("send_invite", ({toUserId, fromUser})=>{
                const targetSocketId = this.userSocket.get(toUserId)
                if(targetSocketId){
                    const roomId = `room_${fromUser.id}_${Date.now()}`

                    this.io.to(targetSocketId).emit("recieve_invite", {fromUser, roomId})
                }
            })

            // accept room invitation
            socket.on("accept-invite",(roomId, hostId)=>{
                const hostSocketId = this.userSocket.get(hostId)
                socket.join(roomId)

                const hostSocket = this.io.sockets.sockets.get(hostSocketId!)
                if(hostSocket){
                    hostSocket.join(roomId)
                    // acept notify
                    this.io.to(hostSocketId!).emit("invite_accepted",{
                        guestId: Array.from(this.userSocket.entries()).find(([_,id])=> id === socket.id)?.[0],
                        roomId
                    })
                }
                logger.info(`Room ${roomId} active between host ${hostId} and guest`);
            })

            // reject room invitation
            socket.on("reject_invite",({hostId})=>{
                const hostSocketId = this.userSocket.get(hostId)
                if(hostSocketId){
                    this.io.to(hostSocketId).emit("reject-invite", {
                        message: "declined"
                    })
                }
            })


            // disconnect room
            socket.on("disconnect", ()=>{
                for(const [userId, socketId] of this.userSocket.entries()){
                    if(socketId === socket.id){
                        this.userSocket.delete(userId)
                        break;
                    }
                }
            })
        })
    }
}