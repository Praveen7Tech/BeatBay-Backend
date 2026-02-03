import { NextFunction, Response } from "express";
import { AuthRequest } from "../../../middleware/auth/authMiddleware";
import { StatusCode } from "../../../../common/constants/status.enum";
import { MESSAGES } from "../../../../common/constants/constants.message";
import { ChangePasswordRequestDTO, EditProfileRequestDTO } from "../../../../application/dto/profile/profile.dto";
import { ChangePasswordSchema, EditProfileSchema } from "../../validators/profile/profile.validators";
import { UploadSongDTO } from "../../../../application/dto/song/song.dto";
import { EditSongRequestSchema, UploadSongRequestSchema } from "../../validators/song/song.validator";
import { CreateAlbumDTO } from "../../../../application/dto/album/album.dto";
import { CreateAlbumRequestSchema, EditAlbumRequestSchema } from "../../validators/album/album.validator";
import cloudinary from "../../../../infrastructure/config/cloudinary";
import logger from "../../../../infrastructure/utils/logger/logger";
import { uploadOptionsType } from "../../../../infrastructure/config/cloudinary"; 
import { IGetArtistByIdUseCase } from "../../../../application/interfaces/usecase/artist-features/get-artist-byid-usecase.interface";
import { IArtistEditProfileUsecase } from "../../../../application/interfaces/usecase/artist-features/edit-profile-usecase.interface";
import { IUploadSongUseCase } from "../../../../application/interfaces/usecase/song/artist-upload-song-usecase.interface";
import { IGetSongsUseCase } from "../../../../application/interfaces/usecase/song/artist-get-songs-usecase.interface";
import { IArtistCreateAlbumUseCase } from "../../../../application/interfaces/usecase/album/artist-create-album-usecase.interface";
import { IArtistGetAlbumsUseCase } from "../../../../application/interfaces/usecase/album/artist-get-album-usecase.intrface";
import { IGetSongDetailsByIdUseCase } from "../../../../application/interfaces/usecase/song/artist-getsong-detail-byid-usecase.interface";
import { IEditSongUseCase } from "../../../../application/interfaces/usecase/song/artist-edit-song-usecase.interface";
import { IGetAlbumDetailsByIdUseCase } from "../../../../application/interfaces/usecase/album/artisgetalbum-detail-byid-usecase.interface";
import { IEditAlbumUseCase } from "../../../../application/interfaces/usecase/album/artist-edit-album-usecase.interface";
import { IDeleteSongUseCase } from "../../../../application/interfaces/usecase/song/artist-delete-song-usecase.interface";
import { IDeleteAlbumUsecase } from "../../../../application/interfaces/usecase/album/artist-delete-albu-usecase.interface";
import { IArtistChangePasswordUsecase } from "../../../../application/interfaces/usecase/artist-features/change-password-usecase.interface";
import { IAlbumDetailsEditUseCase } from "../../../../application/interfaces/usecase/album/get-albumdetails-edit-usecase.interface";
import { IGetAllFansUseCase } from "../../../../application/interfaces/usecase/artist/fans/artist-getallfans-usecase.interface";
import { IArtistDashBoardDataUseCase } from "../../../../application/interfaces/usecase/artist/dashboard/artist-dashboard-usecase.interface";
import { IGetArtistOnBoardingLinkUseCase } from "../../../../application/interfaces/usecase/artist/revenue/getOnBoardLink-usecase.interface";
import { ICreateSongUploadUrlsUsecase } from "../../../../application/interfaces/usecase/presigned-url/create-upload-presigneduerl-usecase.interface";

export class ArtistController {
    constructor(
        private readonly _artistEditProfileUsecase: IArtistEditProfileUsecase,
        private readonly _artistChangePasswordUsecase: IArtistChangePasswordUsecase,
        private readonly _artistUploadSongUsecase: IUploadSongUseCase,
        private readonly _artistGetSongsUsecase : IGetSongsUseCase,
        private readonly _artistCreateAlbumUsecase: IArtistCreateAlbumUseCase,
        private readonly _artistGetAlbumsUsecase: IArtistGetAlbumsUseCase,
        private readonly _artistsongDetailsUsecase: IGetSongDetailsByIdUseCase,
        private readonly _editSongUsecase: IEditSongUseCase,
        private readonly _artistAlbumDetailsUsecase: IGetAlbumDetailsByIdUseCase,
        private readonly _artistEditAlbumUsecase: IEditAlbumUseCase,
        private readonly _artistDeleteSongUsecase: IDeleteSongUseCase,
        private readonly _artistDeleteAlbumUsecase: IDeleteAlbumUsecase,
        private readonly _getAlbumDetailsUsecase: IAlbumDetailsEditUseCase,
        private readonly _getArtistDetailsUsecase: IGetArtistByIdUseCase,
        private readonly _getallFansUsecase: IGetAllFansUseCase,
        private readonly _artistDashBoardDataUsecase: IArtistDashBoardDataUseCase,
        private readonly _getArtistOnBoardingLinkUsecase: IGetArtistOnBoardingLinkUseCase,
        private readonly _createSongUploadUrlUsecase: ICreateSongUploadUrlsUsecase,
    ){}

    // editProfile = async(req:AuthRequest, res:Response, next: NextFunction)=>{
    //     try {
    //         const artistId = req.user?.id
    //         const existArtist = await this._getArtistDetailsUsecase.execute(artistId!)

    //         if(!artistId || !existArtist){
    //             return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
    //         }

    //         let profileImageUrl : string | undefined;
    //         let profileImagePublicId : string | undefined

    //         const existingPublicId = existArtist.profileImagePublicId
    //         const ARTIST_FOLDER = `/artist_profile/${artistId}`
            
    //         if(req.file){
    //             const dataURL = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    //             const editOption : uploadOptionsType={
    //                 resource_type:"image",
    //                 public_id: existingPublicId,
    //                 invalidate: true,
    //                 folder: !existingPublicId ? ARTIST_FOLDER : undefined
    //             }

    //             const uploadImage = await cloudinary.uploader.upload(dataURL, editOption)

    //             profileImageUrl = uploadImage.secure_url;
    //             profileImagePublicId = uploadImage.public_id

    //         }
    //         logger.info("artistId r")
    //         const dto : EditProfileRequestDTO = EditProfileSchema.parse({...req.body, profileImage:profileImageUrl}) 
    //         if(profileImagePublicId) dto.profileImagePublicId = profileImagePublicId

    //         const result = await this._artistEditProfileUsecase.execute(artistId,dto)

    //         return res.status(StatusCode.OK).json({user:result.user,message:MESSAGES.PROFILE_UPDATED})            
    //     } catch (error) {
    //         next(error)
    //     }
    // }
    
    changePassword = async(req:AuthRequest, res:Response, next: NextFunction) =>{
        try {
            const artistId = req.user?.id
            if(!artistId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const dto : ChangePasswordRequestDTO = ChangePasswordSchema.parse(req.body) 
            
            await this._artistChangePasswordUsecase.execute(artistId, dto)

            return res.status(StatusCode.OK).json({message: MESSAGES.PASSWORD_UPDATED})
        } catch (error) {
            next(error)
        }
    }
     
    // song upload link
    getUploadLink = async(req:AuthRequest, res:Response, next: NextFunction)=>{
        try {
            const artistId = req.user?.id
            const {files, uploadId} = req.body;
 
            if(!artistId || !files){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const urls = await this._createSongUploadUrlUsecase.execute(artistId, files, uploadId)

            return res.status(StatusCode.OK).json(urls)

        } catch (error) {
            next(error)
        }
    }

    upLoadSong = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const artistId = req.user?.id;
            if (!artistId) {
                return res
                    .status(StatusCode.UNAUTHORIZED)
                    .json({ message: MESSAGES.UNAUTHORIZED });
            }

            const rawBody = req.body;

            const transformedTags = rawBody.tags
                ?.split(",")
                .map((tag: string) => tag.trim())
                .filter((tag: string) => tag.length > 0) || [];

            const validatedData = UploadSongRequestSchema.parse({
                uploadId: rawBody.uploadId,
                title: rawBody.title,
                description: rawBody.description,
                genre: rawBody.genre,
                tags: rawBody.tags,
                duration: rawBody.duration,

                trackKey: rawBody.audioKey,
                coverKey: rawBody.coverKey,
                lyricsKey: rawBody.lyricsKey,
            });

            const dto: UploadSongDTO = {
                uploadId: validatedData.uploadId,
                title: validatedData.title,
                description: validatedData.description,
                genre: validatedData.genre,
                tags: transformedTags,
                duration: validatedData.duration,

                trackKey: validatedData.trackKey,
                coverKey: validatedData.coverKey,
                lyricsKey: validatedData.lyricsKey,
                
            };

            await this._artistUploadSongUsecase.execute(artistId, dto);

            return res.status(StatusCode.CREATED).json({ message: "New Song uploaded successfully" });
        } catch (error) {
            next(error);
        }
    };

    editSong = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { songId } = req.params;
            const artistId = req.user?.id;
            const updateData = req.body 

            if (!artistId || !songId || !updateData) {
                return res.status(StatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
            }

            // Transform tags if present
            if (updateData.tags) {
                updateData.tags = updateData.tags
                    .split(",")
                    .map((tag: string) => tag.trim())
                    .filter((tag: string) => tag.length > 0);
            }
           
            // Validate with Zod schema
            const validatedDto = EditSongRequestSchema.parse(updateData);
            await this._editSongUsecase.execute(songId, validatedDto);

            return res.status(StatusCode.OK).json({ message: "Song updated successfully" });
        } catch (error) {
            next(error);
        }
    };


    fetchSongs = async(req:AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const artistId = req.user?.id
            if(!artistId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }
            const result = await this._artistGetSongsUsecase.execute(artistId)

            return res.status(StatusCode.OK).json(result.songs)
        } catch (error) {
            next(error)
        }
    }

    createAlbum = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const artistId = req.user?.id
            if(!artistId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            let coverImageUrl : string | undefined
            let coverImagePublicId : string | undefined
            if(req.file){
                const dataURL = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
                const CoverImageUpload = await cloudinary.uploader.upload(dataURL,{
                    folder: `album/${artistId}/coverImage`,
                    resource_type: 'image'
                })

                coverImageUrl = CoverImageUpload.secure_url
                coverImagePublicId = CoverImageUpload.public_id
            }

            const dto: CreateAlbumDTO = CreateAlbumRequestSchema.parse({
                ...req.body, 
                coverImageUrl: coverImageUrl,
                coverImagePublicId: coverImagePublicId 
            })

            await this._artistCreateAlbumUsecase.execute(artistId, dto)

            return res.status(StatusCode.CREATED).json({message: "New album created successfully."})
        } catch (error) {
            next(error)
        }
    }

    fetchAlbums = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
           const artistId = req.user?.id 
           if(!artistId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
           }

           const response = await this._artistGetAlbumsUsecase.execute(artistId)
           return res.status(StatusCode.OK).json(response)

        } catch (error) {
            next(error)
        }
    }

    getSongById = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const artistId = req.user?.id
            const songId = req.params.songId
            if(!artistId || !songId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const result =  await this._artistsongDetailsUsecase.execute(songId)

            return res.status(StatusCode.OK).json(result)
        } catch (error) {
            next(error)
        }
    }


    getAlbumById = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const artistId = req.user?.id
            const albumId = req.params.albumId
            if(!artistId || !albumId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const result =  await this._artistAlbumDetailsUsecase.execute(albumId)

            return res.status(StatusCode.OK).json(result)
        } catch (error) {
            next(error)
        }
    }

    editAlbum = async(req: AuthRequest, res:Response, next: NextFunction)=>{
        try {
            const artistId = req.user?.id
            const albumId = req.params.albumId
            if(!artistId || !albumId ){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const existingAlbum = await this._getAlbumDetailsUsecase.execute(albumId)
            if(!existingAlbum){
                return res.status(StatusCode.NOT_FOUND).json({message: "album not found"})
            }
   
            
            let coverImageUrl: string | undefined = undefined;
            let coverImagePublicId: string | undefined = undefined;

            if (req.file) {
                const dataURL = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
                const existingPublicId = existingAlbum.coverImagePublicId;

                const uploadOptions: uploadOptionsType = {
                    resource_type: 'image',
                    public_id: existingPublicId, // existing ID with folder to overwrite
                    invalidate: true // invalidate CDN cache
                };

                const coverImageUpload = await cloudinary.uploader.upload(dataURL, uploadOptions);
                
                coverImageUrl = coverImageUpload.secure_url;
                coverImagePublicId = coverImageUpload.public_id; 
            }

            const dto : Partial<CreateAlbumDTO>= EditAlbumRequestSchema.parse({...req.body})
            if (coverImageUrl) dto.coverImageUrl = coverImageUrl;
            if (coverImagePublicId) dto.coverImagePublicId = coverImagePublicId;

            await this._artistEditAlbumUsecase.execute(artistId,albumId, dto)

            return res.status(StatusCode.CREATED).json({message: "album updated successfully."})
        } catch (error) {
            next(error)
        }
    }

    deleteSong = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const artistId = req.user?.id
            const songId = req.params.songId
            
            if(!artistId || !songId ){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const result = await this._artistDeleteSongUsecase.execute(songId, artistId)
            return res.status(StatusCode.OK).json(result)
        } catch (error) {
            next(error)
        }
    }

    deleteAlbum = async(req: AuthRequest, res:Response, next: NextFunction)=>{
        try {
            const artistId = req.user?.id
            const albumId = req.params.albumId
            
            if(!artistId || !albumId ){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const result = await this._artistDeleteAlbumUsecase.execute(albumId, artistId)
            return res.status(StatusCode.OK).json(result)
        } catch (error) {
            next(error)
        }
    }

    getFans = async(req:AuthRequest, res:Response, next:NextFunction)=>{
        try {
            const artistId = req.user?.id
            const page = Number(req.query.page)
            const limit = Number(req.query.limit) || 5
            if(!artistId || !page){
                return res.status(StatusCode.UNAUTHORIZED).json(MESSAGES.UNAUTHORIZED)
            }

            const fans = await this._getallFansUsecase.execute(artistId,page,limit)
    
            return res.status(StatusCode.OK).json(fans)
        } catch (error) {
            next(error)
        }
    }

    dashBoard = async(req:AuthRequest, res:Response, next:NextFunction)=>{
        try {
            const artistId = req.user?.id
            if(!artistId) return res.status(StatusCode.UNAUTHORIZED).json(MESSAGES.UNAUTHORIZED);

            const data = await this._artistDashBoardDataUsecase.execute(artistId)

            return res.status(StatusCode.OK).json(data)
        } catch (error) {
            next(error)
        }
    }

    payoutOnboarding = async(req:AuthRequest, res:Response, next:NextFunction)=>{
        try {
           const artistId = req.user?.id
           if(!artistId){
              return res.status(StatusCode.UNAUTHORIZED).json(MESSAGES.UNAUTHORIZED);
           } 

           const data = await this._getArtistOnBoardingLinkUsecase.execute(artistId)

           return res.status(StatusCode.OK).json({success: true, link: data.link})
        } catch (error) {
            next(error)
        }
    }
}