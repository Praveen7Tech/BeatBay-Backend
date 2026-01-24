
export interface ISubscriptionSuccessUseCase{
    execute(isPremium:boolean,stripCustomerId:string,subscriptionId:string,subscriptionStatus: string): Promise<boolean>
}