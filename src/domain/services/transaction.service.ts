
import { ClientSession } from "mongoose";

export interface ITransactionManager {
    withTransaction<T>(fn: (session: ClientSession)=> Promise<T>): Promise<T |null>
}