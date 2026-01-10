
export interface IMongooseLikesRepository{
    toggleLike(songId:string, userId: string): Promise<boolean>
}