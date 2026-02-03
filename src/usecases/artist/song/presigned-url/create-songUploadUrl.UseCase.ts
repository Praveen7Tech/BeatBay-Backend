import { nanoid } from "nanoid";
import { FileType, ICreateSongUploadUrlsUsecase, UploadUrlItem, UploadUrlResponse } from "../../../../application/interfaces/usecase/presigned-url/create-upload-presigneduerl-usecase.interface";
import { IAWSS3StorageService } from "../../../../domain/services/aws/asw-s3.service";

export class CreateSongUploadURLUsecase implements ICreateSongUploadUrlsUsecase
{
  constructor(
    private readonly _awsStorageService: IAWSS3StorageService
  ) {}

  async execute( artistId: string, files: FileType[], existUploadId?:string): Promise<UploadUrlResponse> {

    const songUploadId = existUploadId || nanoid()
    const uploadGroupId = `${artistId}/${songUploadId}`; 

    const links: Partial<Record<FileType["type"], UploadUrlItem>> = {};

    for (const file of files) {
      const key = `songs/${uploadGroupId}/${file.type}`; 

      const uploadUrl = await this._awsStorageService.getUploadPresignedUrl(key, file.mime);

      links[file.type] = {
        uploadUrl,
        key,
      };
    }

    return {
      uploadId: songUploadId,
      links
    }
  }
}
