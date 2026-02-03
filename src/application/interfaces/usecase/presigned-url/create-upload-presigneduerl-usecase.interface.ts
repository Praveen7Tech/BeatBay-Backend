export interface FileType {
  field: "cover" | "audio" | "lrc";
  fileName: string;
  mimeType: string;
}


export interface UploadUrlItem {
  uploadUrl: string;
  key: string;
}

export interface UploadUrlResponse {
  uploadId: string;
  links: Partial<Record<FileType["field"], UploadUrlItem>>;
} 

export interface ICreateSongUploadUrlsUsecase {
  execute(artistId: string, files: FileType[],existUploadId?:string): Promise<UploadUrlResponse>;
}
