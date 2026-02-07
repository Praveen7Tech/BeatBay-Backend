import { PremiumPrice } from "../../../application/dto/premium/prices.dto";
import { IGetPremiumPricesUseCase } from "../../../application/interfaces/usecase/premium/get-prices-usecase.interface";
import { IStripeService } from "../../../domain/services/stripe/stripe.service";

export class GetPremiumPricesUseCase implements IGetPremiumPricesUseCase{
    constructor(
        private readonly _stripeService: IStripeService
    ){}

    async execute(priceIds: string[],country: string): Promise<PremiumPrice[]> {

       const result = await Promise.all(
        priceIds.map(async(id)=>{
            const stripePrice = await this._stripeService.retrievePrice(id)

            const targetCurrency = this._mapCountryocurrency(country)

            const regionalOption = stripePrice.currency_options?.[targetCurrency]

            const finalAmount = regionalOption ? regionalOption.unit_amount : stripePrice.unit_amount;
            const finalCurrency = regionalOption ? targetCurrency : stripePrice.currency;

            return {
                priceId: id,
                amount: (finalAmount || 0) / 100,
                currency: finalCurrency,
                displayPrice: new Intl.NumberFormat('en-IN',{
                    style: "currency",
                    currency: finalCurrency.toUpperCase()
                }).format((finalAmount || 0) / 100)
            }
        })
       )

        return result;
    }

    private _mapCountryocurrency(country:string): string{
        const mapping: Record<string,string>={'IN': "inr", "US":"usd", "GB":"gbp"};
        return mapping[country.toUpperCase() || "usd"]
    }
}