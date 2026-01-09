export interface IFollowingHandleUseCase {
    execute(followId: string, targetId: string, role: string, action: string): Promise<void>;
}