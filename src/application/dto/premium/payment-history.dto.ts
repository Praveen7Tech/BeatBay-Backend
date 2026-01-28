export interface PaymentHistoryDTO{
    id: string
    date: Date
    amount: number
    currency: string
    status: string
    receiptUrl: string
}