import { SubscriptionDTO } from "../../../application/dto/premium/subscription.dto";
import { IUserSubscriptionDataUseCase } from "../../../application/interfaces/usecase/premium/subscription-data-usecase.interface";
import { SubscriptionMapper } from "../../../application/mappers/user/subscription/subscription.mapper";
import { Subscription } from "../../../domain/entities/subscription.entity";
import { ISubscriptionRepository } from "../../../domain/repositories/subscription.repository";

export class UserSubscriptionDataUseCase implements IUserSubscriptionDataUseCase{
    constructor(
        private readonly _subscriptionRepository: ISubscriptionRepository
    ){}

    async execute(userId: string): Promise<SubscriptionDTO | null> {
        
        const data = await this._subscriptionRepository.getSubscription(userId)
        if(!data) return null

        return SubscriptionMapper.toResposneDTO(data as Subscription)
    }
}