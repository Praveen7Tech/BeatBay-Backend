export type SubscriptionStatus = 'Active' | 'Past_due' | 'Unpaid' | 'Canceled' | 'Incomplete' | 'Trialing';
export type PaymentType = 'card' | 'upi' | 'apple_pay' | 'paypal'
export type PlanPeriod = "Monthly" | "6 Months" | 'Yearly'

export interface Subscription{
    id: string
    userId: string
    stripeCustomerId: string
    stripeSubscriptionId: string
    stripePriceId: string
    status: SubscriptionStatus
    priceId: string
    currentPeriodEnd: Date
    cancelAtPeriodEnd: boolean
    planPeriod: string
    amount: number
    currency: string
    paymentMethodType: PaymentType
    paymentMethodDetails: string
}