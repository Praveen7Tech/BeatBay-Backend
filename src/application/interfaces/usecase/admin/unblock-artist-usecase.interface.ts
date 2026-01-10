export interface IUnBlockArtistUseCase {
    execute(artistId: string): Promise<boolean>;
}