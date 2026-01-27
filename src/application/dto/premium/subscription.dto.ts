import { SubscriptionStatus } from "../../../domain/entities/subscription.entity"

export interface SubscriptionDTO{
    id:string
    planName: string
    amount: number
    nextBillingDate: Date
    autoReniewEnable: boolean
    cardInfo: string
    subscriptionId: string
    status:SubscriptionStatus
}