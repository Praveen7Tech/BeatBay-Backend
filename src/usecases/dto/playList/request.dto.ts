export interface CreatePlayListResponseDTO{
    id: string
    name:string
}

export interface PlayListEditRequestDTO{
    name?: string
    coverImage?: string
    description?:string
}