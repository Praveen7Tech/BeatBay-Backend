import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { IAWSS3StorageService } from "../../../domain/services/aws/asw-s3.service";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../../config/aws-s3.config";

export class AWSS3StorageService implements IAWSS3StorageService{
    
     async getUploadPresignedUrl(key: string, contentType: string): Promise<string> {

        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: key,
            ContentType: contentType
        })

        return await getSignedUrl(s3Client,command, {expiresIn: 600})
    }

    async getAccessPresignedUrl(key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: key
        })

        return getSignedUrl(s3Client, command, {expiresIn: 3600})
    }

    async deleteFile(key: string): Promise<void> {
        const command = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: key
        })

        await s3Client.send(command)
    }
}