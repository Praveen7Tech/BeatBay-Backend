import Stripe from "stripe";
import { IHandleWebHookUsecase } from "../../../application/interfaces/usecase/premium/handleWebHook-usecase.interface";
import { IStripeService } from "../../../domain/services/stripe/stripe.service";
import logger from "../../../infrastructure/utils/logger/logger";

export class HandleWebHookUseCase implements IHandleWebHookUsecase{
    constructor(
        private readonly _stripeService: IStripeService
    ){}

    async execute(event: Stripe.Event): Promise<void> {
        
        const data = event.data.object as any

        switch (event.type) {
            case 'checkout.session.completed':
                await this._stripeService.upsertSubscription({
                    userId: data.metadata.userId,
                    stripeCustomerId: data.customer,
                    stripeSubscriptionId: data.subscription,
                    status: 'active',
                    currentPeriodEnd: new Date() 
                });
                logger.info("sucess payment")    
                break;

            case 'invoice.payment_failed':
                await this._stripeService.handlepaymentFailure(data.subscriptionId);
                logger.info("failure payment")
                break;

            case 'customer.subscription.deleted':
                await this._stripeService.deleteSubscription(data.id);
                logger.info("delete subscription")  
                break;
        }
    }
}