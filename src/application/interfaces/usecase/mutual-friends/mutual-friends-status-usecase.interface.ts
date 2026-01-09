export interface IMutualFriendsStatusUseCase {
    execute(userId: string): Promise<Record<string, string>>;
}