import Stripe from "stripe";
import { Subscription } from "../../domain/entities/subscription.entity";
import { CheckoutSessionResponse, IStripeService } from "../../domain/services/stripe/stripe.service";
import { SubscriptionModel } from "../presistence/mongoose/models/subscription.model";
import { UserModel } from "../presistence/mongoose/models/user.model";
import { stripe } from "./stripe.config";
import { PaymentHistoryDTO } from "../../application/dto/premium/payment-history.dto";
import { date } from "zod";

const CLIENT_URL = process.env.FRONTEND_URL

export class StripeService implements IStripeService{
    async createCheckoutSession(userId: string, email: string, priceId: string): Promise<CheckoutSessionResponse> {

        const user = await UserModel.findById(userId)

        const SessionOption : Stripe.Checkout.SessionCreateParams = {
            mode: "subscription",
            line_items: [{price: priceId, quantity: 1}],
            metadata: {userId},
            subscription_data: { metadata: {userId}},
            success_url: `${CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${CLIENT_URL}/payment-failed`,
        }

        if(user?.stripeCustomerId){
            SessionOption.customer = user.stripeCustomerId
        }else{
            SessionOption.customer_email = email
        }

        // const session = await stripe.checkout.sessions.create({
        //     line_items:[{price: priceId, quantity:1}],
        //     mode: 'subscription',
        //     metadata:{userId},
        //     subscription_data:{
        //         metadata:{userId}
        //     },
        //     customer_email: email,
        //     success_url: `${CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        //     cancel_url: `${CLIENT_URL}/payment-failed`,
        // })

        return await stripe.checkout.sessions.create(SessionOption)
    }

    async upsertSubscription(data: Partial<Subscription>): Promise<void> {
           
        await SubscriptionModel.findOneAndUpdate(
            {stripeSubscriptionId: data.stripeSubscriptionId},
            {$set: data},
            {upsert : true, new: true}
        )

        await UserModel.findByIdAndUpdate(data.userId,{
            isPremium: true,
            stripeCustomerId: data.stripeCustomerId
        })
    }

    async deleteSubscription(stripeSubId: string): Promise<void> {
        const sub = await SubscriptionModel.findOneAndUpdate(
            {stripeSubscriptionId: stripeSubId},
            {$set: {status: 'canceled'}},
            {new : true}
        )

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

    async toggleAutoRenewal(subscriptionId: string, autoRenew: boolean): Promise<void> {
        
        await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: !autoRenew
        })
    }

    async cancelSubscription(subscriptionId: string): Promise<void> {
        await stripe.subscriptions.cancel(subscriptionId)
    }

    async getPaymentHistory(stripeCustomerId: string): Promise<Stripe.Invoice[]> {
        const invoices = await stripe.invoices.list({
            customer: stripeCustomerId,
            limit: 20 // Best practice: limit history
        });
        return invoices.data;
    }
}