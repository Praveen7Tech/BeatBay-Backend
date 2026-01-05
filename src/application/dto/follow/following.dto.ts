
export interface FollowingResponseDTO {
    id: string; 
    name: string;
    role: string;
    profilePicture: string; 
}

export interface FollowersResponseDTO {
    docs: FollowingResponseDTO[]; 
    totalPages: number;
    currentPage: number;
    totalDocs: number;
}
