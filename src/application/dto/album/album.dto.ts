export interface CreateAlbumDTO {
    title: string, 
    description: string, 
    coverImageUrl: string,
    coverImagePublicId: string,
    songs:string[],
}

export interface AlbumListDTO {
    id: string;
    title: string;
    artistName: string;
    coverImageUrl: string;
}
