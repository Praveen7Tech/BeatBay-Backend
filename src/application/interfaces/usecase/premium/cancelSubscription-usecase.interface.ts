
export interface ICancelSubscriptionUseCase{
    execute(subscriptionId: string): Promise<boolean>
}