export interface IAddToPlayListUseCase {
    execute(playListId: string, songId: string): Promise<boolean>;
}