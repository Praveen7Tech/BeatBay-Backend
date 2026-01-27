import { SubscriptionDTO } from "../../../dto/premium/subscription.dto";

export interface IUserSubscriptionDataUseCase{
    execute(userId: string): Promise<SubscriptionDTO | null>
}