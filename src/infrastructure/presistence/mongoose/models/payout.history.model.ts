import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import { payoutHistory } from "../../../../domain/entities/payoutHistory.entity";

export type PayoutHistoryDocument = HydratedDocument<payoutHistory>

const PayoutSchema = new Schema({
    artistId: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
    stripeTransferId: { type: String, required: true }, 
    amount: { type: Number, required: true },        
    totalPlaysInPeriod: { type: Number, required: true },
    sharePercentage: { type: Number, required: true },
    period: {
        month: { type: Number, required: true },
        year: { type: Number, required: true }
    },
    status: { type: String, enum: ['completed', 'failed'], default: 'completed' },
    createdAt: { type: Date, default: Date.now }
})

PayoutSchema.index({ artistId: 1, 'period.month': 1, 'period.year': 1 }, { unique: true });

export const PayoutHistoryModel : Model<PayoutHistoryDocument> = mongoose.model<PayoutHistoryDocument>("PayoutHistory", PayoutSchema)