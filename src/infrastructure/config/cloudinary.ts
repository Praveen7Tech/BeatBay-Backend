
import {v2 as cloudinary} from "cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true
})

export default cloudinary;


// overwrite options
export interface uploadOptionsType{
    resource_type: "image" | "video" | "raw" | "auto"; 
    public_id: string | undefined;
    invalidate: boolean
    folder?: string
}