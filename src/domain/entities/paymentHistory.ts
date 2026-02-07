
export type InvoiceStatus = 'paid' | 'open'| 'void'| 'uncollectible'

export interface InvoiceHistory{
    _id: string
    userId: string
    stripeInvoiceId: string
    amount: number
    currency: string
    status: InvoiceStatus
    description: string
    hostedInvoiceUrl:string
    paidAt:Date
}