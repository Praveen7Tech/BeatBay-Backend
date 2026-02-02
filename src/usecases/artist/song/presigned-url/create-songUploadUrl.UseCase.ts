import { FileType, ICreateSongUploadUrlsUsecase, UploadUrlResponse } from "../../../../application/interfaces/usecase/presigned-url/create-upload-presigneduerl-usecase.interface";
import { IAWSS3StorageService } from "../../../../domain/services/aws/asw-s3.service";

export class CreateSongUploadURLUsecase
  implements ICreateSongUploadUrlsUsecase
{
  constructor(
    private readonly _awsStorageService: IAWSS3StorageService
  ) {}

  async execute( artistId: string, files: FileType[]): Promise<UploadUrlResponse> {

    const result = {} as UploadUrlResponse;

    const uploadGroupId = `${artistId}/${Date.now()}`; 

    for (const file of files) {
      const key = `songs/${uploadGroupId}/${file.type}`; 

      const uploadUrl = await this._awsStorageService.getUploadPresignedUrl(key, file.mime);

      result[file.type] = {
        uploadUrl,
        key,
      };
    }

    return result;
  }
}
