import { asClass } from "awilix";
import { UserSubscriptionDataUseCase } from "../../../usecases/user/premium/getUserSubscriptionData.UseCase";
import { ISubscriptionRepository } from "../../../domain/repositories/subscription.repository";
import { SubscriptionRepository } from "../../presistence/mongoose/repositories/mongoose.subscription.repository";
import { CancelSubscriptionUseCase } from "../../../usecases/user/premium/cancelSubscription.UseCae";
import { GetPaymentHistoryUseCase } from "../../../usecases/user/premium/getPaymentHistory.UseCase";

export const subscriptionModule = {

    _subscriptionRepository: asClass<ISubscriptionRepository>(SubscriptionRepository).scoped(),
    _getUserSubscriptionDataUsecase: asClass(UserSubscriptionDataUseCase).scoped(),
    _cancelSubscriptionUseCase: asClass(CancelSubscriptionUseCase).scoped(),
    _getPaymentHistoryUsecase: asClass(GetPaymentHistoryUseCase).scoped(),
}