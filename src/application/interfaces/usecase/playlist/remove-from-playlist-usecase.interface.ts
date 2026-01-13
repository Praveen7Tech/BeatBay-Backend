export interface IRemoveFromPlayListUseCase{
    execute(playlistId:string,songId:string): Promise<boolean>
}