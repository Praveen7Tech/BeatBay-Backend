import { IUpgradeSubscriptionUseCase } from "../../../application/interfaces/usecase/premium/upgrade-subscription-usecase.interface";
import { NotFoundError } from "../../../common/errors/common/common.errors";
import { IUserRepository } from "../../../domain/repositories/user.repository";
import { IStripeService } from "../../../domain/services/stripe/stripe.service";

export class UpgradeSubscriptionCheckOutUseCase implements IUpgradeSubscriptionUseCase{
    constructor(
        private readonly _stripeService: IStripeService,
         private readonly _userRepository: IUserRepository
    ){}

    async execute(userId: string): Promise<string> {

        const user = await this._userRepository.findById(userId)
        if(!user) throw new NotFoundError("user not found!")
        
        const stripeCustomerId = user.stripeCustomerId
        
        const session = await this._stripeService.upgradeSubscriptionSession(stripeCustomerId)

        return session.url
    }
}