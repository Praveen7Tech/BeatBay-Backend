export interface ISubcriptionFailedUsecase{
    execute(subscriptionStatus: string, isPremium: boolean): Promise<boolean>
}