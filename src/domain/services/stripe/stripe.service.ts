import Stripe from "stripe";
import { PaymentHistoryDTO } from "../../../application/dto/premium/payment-history.dto";
import { Subscription } from "../../entities/subscription.entity";

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
    getPaymentHistory(stripeCustomerId: string): Promise<Stripe.Invoice[]>;
}