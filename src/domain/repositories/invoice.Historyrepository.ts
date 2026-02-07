import { InvoiceHistory } from "../entities/paymentHistory";

export interface IInvoiceHistoryRepository{
    createInvoice(data:Partial<InvoiceHistory>): Promise<void>;
    getPaymentHistory(userId: string): Promise<InvoiceHistory[]>
}