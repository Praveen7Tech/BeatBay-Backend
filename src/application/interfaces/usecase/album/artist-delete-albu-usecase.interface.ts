export interface IDeleteAlbumUsecase {
    execute(albumId: string, artistId: string): Promise<boolean>;
}