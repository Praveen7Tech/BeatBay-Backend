
export interface ITrachSongPlayUseCase{
    execute(userId: string, songId:string): Promise<void>
}