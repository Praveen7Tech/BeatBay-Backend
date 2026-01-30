import { PlanPeriod, Subscription, SubscriptionStatus } from "../../../../domain/entities/subscription.entity";
import { ISubscriptionRepository } from "../../../../domain/repositories/subscription.repository";
import { SubscriptionModel } from "../models/subscription.model";

export class SubscriptionRepository implements ISubscriptionRepository{

    async getSubscription(userId: string): Promise<Partial<Subscription> | null> {
        const sub = await SubscriptionModel.findOne({userId})
        .sort({createdAt: -1}).lean()
        
        if(!sub) return null

        return {
            id: sub._id.toString(),
            stripeSubscriptionId: sub.stripeSubscriptionId,
            status: sub.status as SubscriptionStatus,
            planPeriod: sub.planPeriod as PlanPeriod,
            currentPeriodEnd: sub.currentPeriodEnd,
            cancelAtPeriodEnd: sub.cancelAtPeriodEnd,
            localAmount: sub.localAmount,
            currency: sub.currency,
            paymentMethodDetails: sub.paymentMethodDetails,
        }
    }
}