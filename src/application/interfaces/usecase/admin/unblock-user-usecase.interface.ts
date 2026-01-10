export interface IUnBlockUserUseCase {
    execute(userId: string): Promise<boolean>;
}