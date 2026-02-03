export interface FileType {
  type: "cover" | "audio" | "lrc";
  mime: string;
}

export interface UploadUrlItem {
  uploadUrl: string;
  key: string;
}

export interface UploadUrlResponse {
  uploadId: string;
  links: Partial<Record<FileType["type"], UploadUrlItem>>;
} 

export interface ICreateSongUploadUrlsUsecase {
  execute(artistId: string, files: FileType[],existUploadId?:string): Promise<UploadUrlResponse>;
}
