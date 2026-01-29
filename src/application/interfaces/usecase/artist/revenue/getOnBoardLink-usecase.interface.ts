import { PayoutOnboardResponseDTO } from "../../../../dto/artist/revenue/payout.onbaord.dto";

export interface IGetArtistOnBoardingLinkUseCase{
    execute(artistId:string): Promise<PayoutOnboardResponseDTO>
}