
export interface IUnRegisterSocketUseCase{
    execute(userId:string): Promise<void>
}