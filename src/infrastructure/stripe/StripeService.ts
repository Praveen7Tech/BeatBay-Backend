import { Subscription } from "../../domain/entities/subscription.entity";
import { CheckoutSessionResponse, IStripeService } from "../../domain/services/stripe/stripe.service";
import { SubscriptionModel } from "../presistence/mongoose/models/subscription.model";
import { UserModel } from "../presistence/mongoose/models/user.model";
import { stripe } from "./stripe.config";

const CLIENT_URL = process.env.FRONTEND_URL

export class StripeService implements IStripeService{
    async createCheckoutSession(userId: string, email: string, priceId: string): Promise<CheckoutSessionResponse> {
        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            line_items:[{price: priceId, quantity:1}],
            mode: 'subscription',
            metadata:{userId},
            customer_email: email,
            success_url: `${CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${CLIENT_URL}/payment-failed`
        })

        return session
    }

    async upsertSubscription(data: Partial<Subscription>): Promise<void> {
    console.log("sub data", data)    
        await SubscriptionModel.findOneAndUpdate(
            {stripeCustomerId: data.stripeSubscriptionId},
            {$set: data},
            {upsert : true}
        )

        await UserModel.findByIdAndUpdate(data.userId,{
            isPremium: true,
            stripCustomerId: data.stripeCustomerId
        })
    }

    async deleteSubscription(stripeSubId: string): Promise<void> {
        const sub = await SubscriptionModel.findOneAndDelete({stripeSubscriptionId: stripeSubId})

        if(sub){
            await UserModel.findByIdAndUpdate(sub.userId, {isPremium: false})
        }
    }

    async handlePaymentFailure(subscriptionId: string): Promise<void> {
        await SubscriptionModel.findOneAndUpdate(
            {stripeSubscriptionId: subscriptionId},
            {$set: {status: "past_due"}}
        )
    }
}