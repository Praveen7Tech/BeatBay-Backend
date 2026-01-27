
export interface IToggleAutoRenewalUseCase{
    execute(subscriptionId: string, autoRenew: boolean): Promise<boolean>
}