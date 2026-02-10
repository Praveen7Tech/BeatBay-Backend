import { ICloudinaryStorageService, OptionType, UploadImageResponse } from "../../../domain/services/cloudinary.storage.service";
import cloudinary from "../../config/cloudinary";

export class CloudinaryStorageService implements ICloudinaryStorageService{
    
    async uploadImage(file: Buffer, mimetype: string, options: OptionType): Promise<UploadImageResponse> {
        
        const dataUrl = `data:${mimetype};base64,${file.toString("base64")}`
        const uploadRes = await cloudinary.uploader.upload(dataUrl,{
            public_id:options.publicId,
            folder: options.folder,
            overwrite: !!options.publicId,
            invalidate: true
        })

        return {
            url: uploadRes.secure_url,
            publicId: uploadRes.public_id
        }
    }
}