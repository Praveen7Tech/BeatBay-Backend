
import { SubscriptionDTO } from "../../../dto/premium/subscription.dto";
import { Subscription } from "../../../../domain/entities/subscription.entity";

export class SubscriptionMapper{
    static toResposneDTO = (sub:Subscription): SubscriptionDTO=>({
        id: sub.id,
        planName: `${sub.planPeriod} Plan`,
        amount: sub.amount,
        autoReniewEnable: sub.cancelAtPeriodEnd,
        cardInfo: sub.paymentMethodDetails,
        nextBillingDate: sub.currentPeriodEnd,
        subscriptionId: sub.stripeSubscriptionId,
        status: sub.status
    })
}