export interface IBlockArtistUseCase {
    execute(artistId: string): Promise<boolean>;
}