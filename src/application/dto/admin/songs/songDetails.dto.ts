
export interface AdminSongDetailsDTO {
  id: string;
  title: string;
  coverImageUrl: string;
  artistName: string;
  duration: number;
  genre: string;
  tags: string[];
  description: string;
  status: boolean
  releaseDate: Date;
}
