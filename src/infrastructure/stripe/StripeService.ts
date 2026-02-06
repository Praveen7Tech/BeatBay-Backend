import Stripe from "stripe";
import { Subscription } from "../../domain/entities/subscription.entity";
import { CheckoutSessionResponse, IStripeService } from "../../domain/services/stripe/stripe.service";
import { SubscriptionModel } from "../presistence/mongoose/models/subscription.model";
import { UserModel } from "../presistence/mongoose/models/user.model";
import { stripe } from "./stripe.config";

const CLIENT_URL = process.env.FRONTEND_URL

export class StripeService implements IStripeService{
    async createCheckoutSession(userId: string, email: string, priceId: string): Promise<CheckoutSessionResponse> {
        const user = await UserModel.findById(userId);
        let stripeCustomerId = user?.stripeCustomerId;

        // retrieve the customer to see if it exists in sandbox environment 
        if (stripeCustomerId) {
            try {
                await stripe.customers.retrieve(stripeCustomerId);
            } catch (error) {
                stripeCustomerId = undefined; 
            }
        }

        // If no ID or ID was invalid/from another mode, create a new one
        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: email,
                metadata: { userId }
            });
            stripeCustomerId = customer.id;

            await UserModel.findByIdAndUpdate(userId, { stripeCustomerId });
        }

        const SessionOption: Stripe.Checkout.SessionCreateParams = {
            mode: "subscription",
            customer: stripeCustomerId,
            line_items: [{ price: priceId, quantity: 1 }],
            success_url: `${CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${CLIENT_URL}/payment-failed`,
            subscription_data: { metadata: { userId } },
        };

        return await stripe.checkout.sessions.create(SessionOption);
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


    async createConnectAccount(): Promise<Stripe.Account> {
        const account = await stripe.accounts.create({
            type: "express",
            capabilities:{
                transfers: {requested: true}
            }
        })

        return account
    }

    async createOnBoardingLink(stripeConnectId: string): Promise<string> {
        
        const link = await stripe.accountLinks.create({
            account: stripeConnectId,
            refresh_url: `${process.env.FRONTEND_URL}/payout-error`,
            return_url: `${process.env.FRONTEND_URL}/artist/revenue`,
            type: "account_onboarding"
        })

        return link.url
    }

     async getNetRevenue(startDate: Date, endDate: Date): Promise<number> {
        const payments = await stripe.paymentIntents.list({
            created: { gte: Math.floor(startDate.getTime() / 1000), lte: Math.floor(endDate.getTime() / 1000) },
            expand: ['data.latest_charge.balance_transaction'], 
            limit: 100,
        });

        return payments.data.reduce((acc, pay) => {
            const charge = pay.latest_charge as Stripe.Charge;
            const bt = charge?.balance_transaction as Stripe.BalanceTransaction;
            
            //  'bt.net' to get the USD cents that hit balance after conversion
            return acc + (bt?.net || 0); 
        }, 0);
    }

    async transferToArtist(amount: number, connectId: string, description: string): Promise<Stripe.Transfer> {
   console.log("payment amount", amount, connectId)     
        return await stripe.transfers.create({
            amount: Math.round(amount),
            currency: 'usd',
            destination: connectId,
            description: description
        })
    }

    async getArtistWallet(connectId: string): Promise<Stripe.Balance> {
        const balance = await stripe.balance.retrieve({
            stripeAccount: connectId
        })

        return balance
    }

    async getArtistCurrency(connectId: string): Promise<string> {
        const account = await stripe.accounts.retrieve(connectId);
        // Returns lowercase code like 'usd' or 'inr'
        return account.default_currency || 'usd'; 
    }

    async createStripeLoginLink(connectId: string): Promise<string> {
        const loginLink = await stripe.accounts.createLoginLink(connectId);
        return loginLink.url; 
    }

    async retrievePrice(priceId: string): Promise<Stripe.Price> {
        return await stripe.prices.retrieve(priceId);
    }
}