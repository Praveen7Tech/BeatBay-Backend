import { PremiumPrice } from "../../../dto/premium/prices.dto";

export interface IGetPremiumPricesUseCase{
    execute(priceIds: string[],country: string): Promise<PremiumPrice[]>
}