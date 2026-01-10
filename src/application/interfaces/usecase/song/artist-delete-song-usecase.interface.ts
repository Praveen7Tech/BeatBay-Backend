export interface IDeleteSongUseCase {
    execute(songId: string, artistId: string): Promise<boolean>;
}