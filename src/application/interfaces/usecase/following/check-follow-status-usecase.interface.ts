export interface ICheckFollowStatusUseCase {
    execute(followerId: string, targetId: string, role: string): Promise<boolean>;
}