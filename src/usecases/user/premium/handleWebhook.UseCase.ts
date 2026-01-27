import Stripe from "stripe";
import { IHandleWebHookUsecase } from "../../../application/interfaces/usecase/premium/handleWebHook-usecase.interface";
import { IStripeService } from "../../../domain/services/stripe/stripe.service";
import logger from "../../../infrastructure/utils/logger/logger";

export class HandleWebHookUseCase implements IHandleWebHookUsecase{
    constructor(
        private readonly _stripeService: IStripeService
    ){}

    async execute(event: Stripe.Event): Promise<void> {
        
        //const data = event.data.object as any

        switch (event.type) {
            case 'checkout.session.completed':

                const session = event.data.object as Stripe.Checkout.Session
        console.log("session ", session)
                await this._stripeService.upsertSubscription({
                    userId: session.metadata?.userId,
                    stripeCustomerId: session.customer as string,
                    stripeSubscriptionId: session.subscription as string,
                    stripePriceId: session.line_items?.data[0]?.price?.id,
                    status: 'active',
                    currentPeriodEnd: new Date() 
                });
                logger.info("sucess payment")    
                break;

            case 'invoice.payment_failed':

                 const invoice = event.data.object as Stripe.Invoice;
                 const subscriptionId = (invoice as any).subscription as string;
            console.log("invoice ", invoice)    
                if (subscriptionId) {
                    await this._stripeService.handlePaymentFailure(subscriptionId);
                    logger.info(`Payment failure for subscription: ${subscriptionId}`);
                }

            case 'customer.subscription.deleted':

                const subscription = event.data.object as Stripe.Subscription
            console.log("sub ", subscription)    
                await this._stripeService.deleteSubscription(subscription.id);
                logger.info("delete subscription")  
                break;
        }
    }
}