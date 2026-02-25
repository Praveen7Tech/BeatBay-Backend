import Stripe from "stripe";
import { IHandleWebHookUsecase } from "../../../application/interfaces/usecase/premium/handleWebHook-usecase.interface";
import { IStripeService } from "../../../domain/services/stripe/stripe.service";
import logger from "../../../infrastructure/utils/logger/logger";
import { PaymentType, PlanPeriod, SubscriptionStatus } from "../../../domain/entities/subscription.entity";
import { stripe } from "../../../infrastructure/stripe/stripe.config";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { IInvoiceHistoryRepository } from "../../../domain/repositories/invoice.Historyrepository";
import { InvoiceStatus } from "../../../domain/entities/paymentHistory";

export class HandleWebHookUseCase implements IHandleWebHookUsecase{
    constructor(
        private readonly _stripeService: IStripeService,
        private readonly _artistRepository: IArtistRepository,
        private readonly _invoiceRepository: IInvoiceHistoryRepository
    ){}

    async execute(event: Stripe.Event): Promise<void> {

        switch (event.type) {
            case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            // only use session to link user ID and customer ID

            logger.info("checkout session event triggerd")
         
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

                logger.info("subscription session event triggerd")

                const subscription = event.data.object as Stripe.Subscription;
                const item = subscription.items.data[0]; 
                const recurring = item.price.recurring;
                const priceId = item.price.id
                const userCurrency = subscription.currency.toLowerCase()
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

                const fullPrice = await this._stripeService.retrievePrice(priceId)
                let localAmountDecimal = 0;

                if(fullPrice.currency_options?.[userCurrency]?.unit_amount){
                    localAmountDecimal = fullPrice.currency_options[userCurrency].unit_amount / 100 
                }else{
                    localAmountDecimal = (fullPrice.unit_amount || 0) / 100
                }


                const latestInvoice = await stripe.invoices.retrieve(subscription.latest_invoice as string);

                const amountUSD = item.price.unit_amount || 0
                const actualPaidToday = latestInvoice.amount_paid / 100 || 0

                await this._stripeService.upsertSubscription({
                    userId: subscription.metadata.userId, 
                    stripeSubscriptionId: subscription.id,
                    stripeCustomerId: subscription.customer as string,
                    stripePriceId: item.price.id,
                    status: subscription.status as SubscriptionStatus,
                    currentPeriodEnd: periodEnd,
                    cancelAtPeriodEnd: subscription.cancel_at_period_end,
                    //datas
                    amountUSD: amountUSD,
                    localAmount:localAmountDecimal,
                    currency: subscription.currency,

                    planPeriod: planPeriod,
                    paymentMethodType:paymentType as PaymentType,
                    paymentMethodDetails: paymentMethodDetails
                });

                logger.info("subscription creted successfully!")
                break;
            }
            
            case 'invoice.paid' : {

                logger.info("invoice paid event trigger")

                const invoice = event.data.object as Stripe.Invoice
                let subscriptionId;

                if (invoice.parent?.type === "subscription_details") {
                    subscriptionId = invoice.parent.subscription_details?.subscription;
                }

                if (!subscriptionId) {
                    console.log("no subscription found for invoice:", invoice.id);
                    break;
                }
               
                const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);

                const userId = subscription.metadata.userId
              
                if(userId){
                     await this._invoiceRepository.createInvoice({
                        userId: userId,
                        stripeInvoiceId: invoice.id,
                        amount:invoice.amount_paid / 100,
                        currency: invoice.currency,
                        status: invoice.status as InvoiceStatus,
                        description: invoice.billing_reason === "subscription_update" ?
                         "Plan Upgrade / Downgrade" : "Subscription Renewal",
                        hostedInvoiceUrl: invoice.hosted_invoice_url as string,
                        paidAt: new Date(invoice.status_transitions.paid_at! * 1000)
                     })
                }
                logger.info("invoice created successfull!")

                break;
            }

            case 'invoice.payment_failed':{

                logger.info("invoice failed event trigger")

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

                logger.info("account update session event trigger")

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