export interface CreatePlayListResponseDTO{
    id: string
    name:string
}

export interface PlayListEditRequestDTO{
    name?: string
    coverImage?: string
    description?:string
}

export interface UserPlaylistResponse{
    id: string
    name: string
    coverImageUrl?: string | null
}