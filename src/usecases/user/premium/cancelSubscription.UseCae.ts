import { ICancelSubscriptionUseCase } from "../../../application/interfaces/usecase/premium/cancelSubscription-usecase.interface";
import { IStripeService } from "../../../domain/services/stripe/stripe.service";

export class CancelSubscriptionUseCase implements ICancelSubscriptionUseCase{
    constructor(
        private readonly _stripeService: IStripeService
    ){}

    async execute(subscriptionId: string): Promise<boolean> {
        
        await this._stripeService.cancelSubscription(subscriptionId)

        return true
    }
}