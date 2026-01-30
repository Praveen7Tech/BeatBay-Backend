import { asClass } from "awilix";
import { UserSubscriptionDataUseCase } from "../../../usecases/user/premium/getUserSubscriptionData.UseCase";
import { ISubscriptionRepository } from "../../../domain/repositories/subscription.repository";
import { SubscriptionRepository } from "../../presistence/mongoose/repositories/mongoose.subscription.repository";
import { CancelSubscriptionUseCase } from "../../../usecases/user/premium/cancelSubscription.UseCae";
import { GetPaymentHistoryUseCase } from "../../../usecases/user/premium/getPaymentHistory.UseCase";
import { ProcessMonthlyPayoutUseCase } from "../../../usecases/payout/process-monthly-payout.UseCase";
import { PayoutHistoryRepository } from "../../presistence/mongoose/repositories/mongoose.payout.history.repository";
import { IPayoutHistoryRepository } from "../../../domain/repositories/payoutHistory.repository";

export const subscriptionModule = {

    _subscriptionRepository: asClass<ISubscriptionRepository>(SubscriptionRepository).scoped(),
    _getUserSubscriptionDataUsecase: asClass(UserSubscriptionDataUseCase).scoped(),
    _cancelSubscriptionUseCase: asClass(CancelSubscriptionUseCase).scoped(),
    _getPaymentHistoryUsecase: asClass(GetPaymentHistoryUseCase).scoped(),

    processMonthlyPayoutUsecase: asClass(ProcessMonthlyPayoutUseCase).singleton(),
    _payoutHistoryRepository: asClass<IPayoutHistoryRepository>(PayoutHistoryRepository).scoped()
}