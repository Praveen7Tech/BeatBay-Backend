import { asClass } from "awilix";
import { UserSubscriptionDataUseCase } from "../../../usecases/user/premium/getUserSubscriptionData.UseCase";
import { ISubscriptionRepository } from "../../../domain/repositories/subscription.repository";
import { SubscriptionRepository } from "../../presistence/mongoose/repositories/mongoose.subscription.repository";

export const subscriptionModule = {

    _subscriptionRepository: asClass<ISubscriptionRepository>(SubscriptionRepository).scoped(),
    _getUserSubscriptionDataUsecase: asClass(UserSubscriptionDataUseCase).scoped()
}