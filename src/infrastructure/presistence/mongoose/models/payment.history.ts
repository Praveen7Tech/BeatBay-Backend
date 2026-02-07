import mongoose, { HydratedDocument, Model, Schema } from "mongoose";
import { InvoiceHistory } from "../../../../domain/entities/paymentHistory";

export type PaymentHistoryDocument = HydratedDocument<InvoiceHistory>

const PaymentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stripeInvoiceId: { type: String, unique: true },
    amount: { type: Number, required: true }, 
    currency: { type: String, required: true },
    status: { type: String, enum: ['paid', 'open', 'void', 'uncollectible'], default: 'paid' },
    description: { type: String }, 
    hostedInvoiceUrl: { type: String }, 
    paidAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const InvoiceHistoryModel : Model<PaymentHistoryDocument> = mongoose.model<PaymentHistoryDocument>("PaymentHistory", PaymentSchema)