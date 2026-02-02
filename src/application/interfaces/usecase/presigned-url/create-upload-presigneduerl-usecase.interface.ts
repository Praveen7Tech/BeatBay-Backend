export interface FileType {
  type: "cover" | "audio" | "lrc";
  mime: string;
}

export interface UploadUrlItem {
  uploadUrl: string;
  key: string;
}

export type UploadUrlResponse = Record<FileType["type"], UploadUrlItem>;

export interface ICreateSongUploadUrlsUsecase {
  execute(artistId: string, files: FileType[]): Promise<UploadUrlResponse>;
}
