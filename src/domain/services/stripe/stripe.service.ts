import Stripe from "stripe";
import { PaymentHistoryDTO } from "../../../application/dto/premium/payment-history.dto";
import { Subscription } from "../../entities/subscription.entity";
import { PremiumPrice } from "../../../application/dto/premium/prices.dto";

export interface CheckoutSessionResponse {
    id: string;
    url: string | null;
}

export interface IStripeService{
    createCheckoutSession(userId:string, email:string, priceId:string):Promise<CheckoutSessionResponse>
    upsertSubscription(data: Partial<Subscription>): Promise<void>;
    handlePaymentFailure(subscriptionId: string): Promise<void>
    deleteSubscription(stripeSubId: string): Promise<void>;
    toggleAutoRenewal(subscriptionId: string, autoRenew: boolean): Promise<void>;
    cancelSubscription(subscriptionId: string): Promise<void>;
    createConnectAccount(): Promise<Stripe.Account>
    createOnBoardingLink(stripeConnectId: string): Promise<string>;
    
    getNetRevenue(startDate:Date, endDate:Date): Promise<number>
    transferToArtist(amount: number, connectId: string, description: string): Promise<Stripe.Transfer>;

    getArtistWallet(connectId: string): Promise<Stripe.Balance>
    getArtistCurrency(connectId: string): Promise<string>
    createStripeLoginLink(connectId: string): Promise<string>
    retrievePrice(priceId: string): Promise<Stripe.Price>;

    upgradeSubscriptionSession(stripeCustomerId: string): Promise<{url:string}>
}