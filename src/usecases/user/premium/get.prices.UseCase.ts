import { PremiumPrice } from "../../../application/dto/premium/prices.dto";
import { IGetPremiumPricesUseCase } from "../../../application/interfaces/usecase/premium/get-prices-usecase.interface";
import { IStripeService } from "../../../domain/services/stripe/stripe.service";

export class GetPremiumPricesUseCase implements IGetPremiumPricesUseCase{
    constructor(
        private readonly _stripeService: IStripeService
    ){}

    async execute(priceIds: string[]): Promise<PremiumPrice[]> {
        const prices: PremiumPrice[] = [];

        for (const id of priceIds) {
        const price = await this._stripeService.retrievePrice(id);
            prices.push({
                priceId: price.id,
                amount: price.unit_amount || 0,
                currency: price.currency,
                recurring: price.recurring?.interval || null
            });
        }

        return prices;
    }
}