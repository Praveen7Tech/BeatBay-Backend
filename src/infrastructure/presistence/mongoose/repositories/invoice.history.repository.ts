import { InvoiceHistory } from "../../../../domain/entities/paymentHistory";
import { IInvoiceHistoryRepository } from "../../../../domain/repositories/invoice.Historyrepository";
import { InvoiceHistoryModel } from "../models/payment.history";

export class InvoiceHistoryRepository implements IInvoiceHistoryRepository{

    async createInvoice(data: InvoiceHistory): Promise<void> {
        await InvoiceHistoryModel.findOneAndUpdate(
            {stripeInvoiceId: data.stripeInvoiceId},
            {$set: data},
            {upsert: true, new: true}
        )
    }

    async getPaymentHistory(userId: string): Promise<InvoiceHistory[]> {
        return await InvoiceHistoryModel.find({userId})
         .sort({paidAt: -1})
         .lean()
    }
}