import mongoose, { ClientSession } from "mongoose";
import { ITransactionManager } from "../../../domain/services/transaction.service";

export class MongooseTransactionService implements ITransactionManager{
   async withTransaction<T>(fn: (session: ClientSession) => Promise<T>): Promise<T | null> {
    const session = await mongoose.startSession();
    try {
      let result: T | null = null;
      await session.withTransaction(async () => {
        result = await fn(session);
      });
      return result;
    } finally {
      await session.endSession();
    }
  }
}