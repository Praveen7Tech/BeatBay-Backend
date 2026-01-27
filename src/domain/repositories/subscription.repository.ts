import { Subscription } from "../entities/subscription.entity";

export interface ISubscriptionRepository{
    getSubscription(userId: string): Promise<Partial<Subscription> | null>
}