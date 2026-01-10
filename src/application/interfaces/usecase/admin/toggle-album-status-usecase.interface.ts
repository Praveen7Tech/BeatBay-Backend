export interface IToggleAlbumStatusUseCase {
    execute(albumId: string, targetStatus: boolean): Promise<boolean>;
}