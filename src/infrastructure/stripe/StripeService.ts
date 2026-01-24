import { CheckoutSessionResponse, IStripeService } from "../../domain/services/stripe/stripe.service";
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
}