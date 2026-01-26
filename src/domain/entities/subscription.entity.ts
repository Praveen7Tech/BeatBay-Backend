export type SubscriptionStatus = 'active' | 'past_due' | 'unpaid' | 'canceled' | 'incomplete' | 'trialing';

export interface Subscription{
    id: string
    userId: string
    stripeCustomerId: string
    stripeSubscriptionId: string
    status: SubscriptionStatus
    priceId: string
    currentPeriodEnd: Date
    cancelAtPeriodEbd: boolean
}