import Stripe from "stripe";
import { IHandleWebHookUsecase } from "../../../application/interfaces/usecase/premium/handleWebHook-usecase.interface";
import { IStripeService } from "../../../domain/services/stripe/stripe.service";
import logger from "../../../infrastructure/utils/logger/logger";
import { PaymentType, PlanPeriod, SubscriptionStatus } from "../../../domain/entities/subscription.entity";
import { stripe } from "../../../infrastructure/stripe/stripe.config";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";

export class HandleWebHookUseCase implements IHandleWebHookUsecase{
    constructor(
        private readonly _stripeService: IStripeService,
        private readonly _artistRepository: IArtistRepository
    ){}

    async execute(event: Stripe.Event): Promise<void> {

        switch (event.type) {
            case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            // only use session to link user ID and customer ID
         
            if (session.metadata?.userId) {
                await this._stripeService.upsertSubscription({
                    userId: session.metadata.userId,
                    stripeSubscriptionId: session.subscription as string,
                    stripeCustomerId: session.customer as string,
                    status: 'Active'
                });
            }
            break;
            }

            case 'customer.subscription.created':
            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const item = subscription.items.data[0]; 
                const recurring = item.price.recurring;
                const periodEnd = new Date(item.current_period_end * 1000);
                let paymentMethodDetails = 'N/A'
                let paymentType = "unknown"

                if(subscription.default_payment_method){
                    const pm = await stripe.paymentMethods.retrieve(subscription.default_payment_method as string)
                    paymentType = pm.type

                    if(pm.type == "card"){
                        paymentMethodDetails = `${pm.card?.brand}****${pm.card?.last4}`;
                    }else if(pm.type === "paypal"){
                        paymentMethodDetails = `${pm.paypal?.payer_id}`
                    }else{
                        paymentMethodDetails = pm.type.toUpperCase()
                    }
                }

                 let planPeriod: PlanPeriod = 'Monthly';
    
                if (recurring?.interval === 'month') {
                    if (recurring.interval_count === 1) planPeriod = 'Monthly';
                    else if (recurring.interval_count === 6) planPeriod = '6 Months';
                } else if (recurring?.interval === 'year') {
                    planPeriod = 'Yearly';
                }

                await this._stripeService.upsertSubscription({
                    userId: subscription.metadata.userId, 
                    stripeSubscriptionId: subscription.id,
                    stripeCustomerId: subscription.customer as string,
                    stripePriceId: item.price.id,
                    status: subscription.status as SubscriptionStatus,
                    currentPeriodEnd: periodEnd,
                    cancelAtPeriodEnd: subscription.cancel_at_period_end,
                    //datas
                    amount: (item.price.unit_amount || 0) / 100,
                    currency: item.price.currency,
                    planPeriod: planPeriod,
                    paymentMethodType:paymentType as PaymentType,
                    paymentMethodDetails: paymentMethodDetails
                });
                break;
            }   

            case 'invoice.payment_failed':{

                 const invoice = event.data.object as Stripe.Invoice;
                 const subscriptionId = (invoice as any).subscription as string;
              
                if (subscriptionId) {
                    await this._stripeService.handlePaymentFailure(subscriptionId);
                    logger.info(`Payment failure for subscription: ${subscriptionId}`);
                }
                break;
            }

            case 'customer.subscription.deleted':{

                const subscription = event.data.object as Stripe.Subscription
               
                await this._stripeService.deleteSubscription(subscription.id);
                logger.info("delete subscription")  
                break;
            }

            case 'account.updated' : {
                const account = event.data.object as Stripe.Account

                if(account.payouts_enabled && account.details_submitted){
                    await this._artistRepository.updatePayoutStatus( account.id,true)
                }
                logger.info("artist payout status updated")    
                break;
            }
        }
    }
}