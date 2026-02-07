export interface IUpgradeSubscriptionUseCase{
    execute(userId:string): Promise<string>
}