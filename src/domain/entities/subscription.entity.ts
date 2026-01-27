export type SubscriptionStatus = 'active' | 'past_due' | 'unpaid' | 'canceled' | 'incomplete' | 'trialing';

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
}