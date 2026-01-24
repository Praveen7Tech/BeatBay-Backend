import { PremiumServiceResponse } from "../../../application/dto/premium/premium.dto";
import { IPremiumSubScriptionUsecase } from "../../../application/interfaces/usecase/premium/subscription-usecase.interface";
import { IStripeService } from "../../../domain/services/stripe/stripe.service";

export class PremiumSubScriptionUseCase implements IPremiumSubScriptionUsecase{
    constructor(
        private readonly _stripeService: IStripeService
    ){}

    async execute(userId:string, email:string, priceId:string): Promise<PremiumServiceResponse> {
        const session = await this._stripeService.createCheckoutSession(userId,email,priceId)

        if (!session.url) {
            throw new Error("Failed to create checkout session");
        }

        return { url: session.url };
    }
}