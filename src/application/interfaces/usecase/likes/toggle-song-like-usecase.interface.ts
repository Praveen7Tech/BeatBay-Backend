export interface IToggleSongLikeUseCase{
    execute(songId: string, userId:string):Promise<boolean>
}