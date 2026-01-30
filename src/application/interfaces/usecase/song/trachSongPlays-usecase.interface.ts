
export interface ITrachSongPlayUseCase{
    execute(userId: string, songId:string, artistId: string): Promise<void>
}