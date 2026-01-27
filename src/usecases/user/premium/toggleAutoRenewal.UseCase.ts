import { IToggleAutoRenewalUseCase }from "../../../application/interfaces/usecase/premium/toggle-auto-renewal-usecase.interface"
import { IStripeService } from "../../../domain/services/stripe/stripe.service";

export class ToggleAutoRenewalUseCase implements IToggleAutoRenewalUseCase{
    constructor(
        private readonly _stripeService: IStripeService
    ){}

    async execute(subscriptionId: string, autoRenew: boolean): Promise<boolean> {
    
        await this._stripeService.toggleAutoRenewal(subscriptionId, autoRenew)

        return true
    }
}