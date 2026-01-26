import Stripe from "stripe";

export interface IHandleWebHookUsecase{
    execute(event: Stripe.Event): Promise<void>
}