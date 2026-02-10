
export interface OptionType{
    folder: string,
    publicId: string
}

export interface UploadImageResponse{
    url: string
    publicId: string
}

export interface ICloudinaryStorageService{
    uploadImage(file:Buffer, mimetype: string, options:OptionType): Promise<UploadImageResponse>
}