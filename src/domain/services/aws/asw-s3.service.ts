export interface IAWSS3StorageService{
    getUploadPresignedUrl(key:string, contentType: string): Promise<string>;
    getAccessPresignedUrl(key: string): Promise<string>;
    deleteFile(key: string): Promise<void>
}