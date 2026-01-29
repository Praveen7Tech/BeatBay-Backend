import { PayoutOnboardResponseDTO } from "../../../application/dto/artist/revenue/payout.onbaord.dto";
import { IGetArtistOnBoardingLinkUseCase } from "../../../application/interfaces/usecase/artist/revenue/getOnBoardLink-usecase.interface";
import { BadRequestError } from "../../../common/errors/common/common.errors";
import { IArtistRepository } from "../../../domain/repositories/artist.repository";
import { IStripeService } from "../../../domain/services/stripe/stripe.service";

export class GetArtistOnBoardingLinkUseCase implements IGetArtistOnBoardingLinkUseCase{
    constructor(
        private readonly _artistRepository: IArtistRepository,
        private readonly _stripeService: IStripeService
    ){}

    async execute(artistId: string): Promise<PayoutOnboardResponseDTO> {
        
        const connectionId = await this._artistRepository.getStripeConnectId(artistId)
        if(!connectionId){
            throw new BadRequestError("artist has no invalid strip connection id!")
        }

        const onBoardLink = await this._stripeService.createOnBoardingLink(connectionId)

        return {link:onBoardLink}
    }
}