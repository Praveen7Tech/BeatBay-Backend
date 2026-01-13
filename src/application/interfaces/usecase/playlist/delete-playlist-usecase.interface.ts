
export interface IDeletePlayListUseCase{
    execute(playlistId: string): Promise<boolean>
}