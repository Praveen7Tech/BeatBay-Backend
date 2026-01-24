import { PremiumServiceResponse } from "../../../dto/premium/premium.dto";

export interface IPremiumSubScriptionUsecase{
    execute(userId:string, email:string, priceId:string): Promise<PremiumServiceResponse>
}