import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../middleware/auth/authMiddleware";
import { StatusCode } from "../../../../common/constants/status.enum";
import { MESSAGES } from "../../../../common/constants/constants.message";
import { ArtistEditProfileUsecase } from "../../../../usecases/artist/profile/artistEditProfile.useCase";
import { ChangePasswordRequestDTO, EditProfileRequestDTO } from "../../../../application/dto/profile/profile.dto";
import { ChangePasswordSchema, EditProfileSchema } from "../../validators/profile/profile.validators";
import { ArtistChangePasswordUsecase } from "../../../../usecases/artist/profile/artistChangePassword.useCase";
import { UploadSongDTO } from "../../../../application/dto/song/song.dto";
import { EditSongRequestSchema, UploadSongRequestSchema } from "../../validators/song/song.validator";
import { UploadSongUseCase } from "../../../../usecases/artist/song/uploadSong.useCase";
import { GetSongsUseCase } from "../../../../usecases/artist/song/getSongs.useCase";
import { ArtistCreateAlbumUseCase } from "../../../../usecases/artist/album/createAlbums.useCase";
import { CreateAlbumDTO } from "../../../../application/dto/album/album.dto";
import { CreateAlbumRequestSchema, EditAlbumRequestSchema } from "../../validators/album/album.validator";
import { artistGetAlbumsUseCase } from "../../../../usecases/artist/album/artistGetAlbums.useCase";
import { GetSongDetailsByIdUseCase } from "../../../../usecases/artist/song/getSongById.useCase";
import { EditSongUseCase } from "../../../../usecases/artist/song/editSong.useCase";
import { GetAlbumDetailsByIdUseCase } from "../../../../usecases/artist/album/getAlbumDetailsById.useCase";
import { EditAlbumUseCase } from "../../../../usecases/artist/album/artistEditAlbum.useCase";
import { DeleteSongUseCase } from "../../../../usecases/artist/song/deleteSong.useCase";
import { DeleteAlbumUsecase } from "../../../../usecases/artist/album/artistDeleteAlbum.useCase";
import cloudinary from "../../../../infrastructure/config/cloudinary";
import logger from "../../../../infrastructure/utils/logger/logger";
import { AlbumDetailsUseCase } from "../../../../usecases/user/album/albumDetails.useCase";
import { uploadOptionsType } from "../../../../infrastructure/config/cloudinary"; 
import { GetArtistByIdUseCase } from "../../../../usecases/admin/artists/adminGetArtistById.useCase";

export class ArtistController {
    constructor(
        private readonly artistEditProfileUsecase:ArtistEditProfileUsecase,
        private readonly artistChangePasswordUsecase: ArtistChangePasswordUsecase,
        private readonly artistUploadSongUsecase: UploadSongUseCase,
        private readonly artistGetSongsUsecase :GetSongsUseCase,
        private readonly artistCreateAlbumUsecase: ArtistCreateAlbumUseCase,
        private readonly artistGetAlbumsUsecase: artistGetAlbumsUseCase,
        private readonly artistsongDetailsUsecase: GetSongDetailsByIdUseCase,
        private readonly editSongUsecase: EditSongUseCase,
        private readonly artistAlbumDetailsUsecase: GetAlbumDetailsByIdUseCase,
        private readonly artistEditAlbumUsecase: EditAlbumUseCase,
        private readonly artistDeleteSongUsecase: DeleteSongUseCase,
        private readonly artistDeleteAlbumUsecase: DeleteAlbumUsecase,
        private readonly getAlbumDetailsUsecase: AlbumDetailsUseCase,
        private readonly getArtistDetailsUsecase: GetArtistByIdUseCase
    ){}

    editProfile = async(req:AuthRequest, res:Response, next: NextFunction)=>{
        try {
            const artistId = req.user?.id
            const existArtist = await this.getArtistDetailsUsecase.execute(artistId!)

            if(!artistId || !existArtist){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            let profileImageUrl : string | undefined;
            let profileImagePublicId : string | undefined

            const existingPublicId = existArtist.profileImagePublicId
            const ARTIST_FOLDER = `/artist_profile/${artistId}`
            
            if(req.file){
                const dataURL = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

                const editOption : uploadOptionsType={
                    resource_type:"image",
                    public_id: existingPublicId,
                    invalidate: true,
                    folder: !existingPublicId ? ARTIST_FOLDER : undefined
                }

                const uploadImage = await cloudinary.uploader.upload(dataURL, editOption)

                profileImageUrl = uploadImage.secure_url;
                profileImagePublicId = uploadImage.public_id

            }
            logger.info("artistId r")
            const dto : EditProfileRequestDTO = EditProfileSchema.parse({...req.body, profileImage:profileImageUrl}) 
            if(profileImagePublicId) dto.profileImagePublicId = profileImagePublicId

            const result = await this.artistEditProfileUsecase.execute(artistId,dto)

            return res.status(StatusCode.OK).json({user:result.user,message:MESSAGES.PROFILE_UPDATED})            
        } catch (error) {
            next(error)
        }
    }
    
    changePassword = async(req:AuthRequest, res:Response, next: NextFunction) =>{
        try {
            const artistId = req.user?.id
            if(!artistId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const dto : ChangePasswordRequestDTO = ChangePasswordSchema.parse(req.body) 
            
            await this.artistChangePasswordUsecase.execute(artistId, dto)

            return res.status(StatusCode.OK).json({message: MESSAGES.PASSWORD_UPDATED})
        } catch (error) {
            next(error)
        }
    }
    
    upLoadSong = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const artistId = req.user?.id;
            if (!artistId) {
                return res.status(StatusCode.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED });
            }

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            if (!files['trackFile'] || !files['coverImage'] || !files['lrcFile']) {
                return res.status(400).json({ message: "Missing required files." });
            }

            const trackFile = files['trackFile'][0];
            const coverImageFile = files['coverImage'][0];
            const lrcFile = files['lrcFile'][0]; 

            // Cloudinary uploads 
            const coverImageUpload = await cloudinary.uploader.upload(
                `data:${coverImageFile.mimetype};base64,${coverImageFile.buffer.toString("base64")}`,
                { folder: `song/${artistId}/coverImage`, resource_type: "image" }
            );

            const audioFileUpload = await cloudinary.uploader.upload(
                `data:${trackFile.mimetype};base64,${trackFile.buffer.toString("base64")}`,
                { folder: `song/${artistId}/trackFile`, resource_type: "video" }
            );

            const lrcFileUpload = await cloudinary.uploader.upload(
                `data:${lrcFile.mimetype};base64,${lrcFile.buffer.toString("base64")}`,
                { folder: `song/${artistId}/lrcFile`, resource_type: "raw" }
            );

            const songFilePath = audioFileUpload.secure_url;
            const coverImagePath = coverImageUpload.secure_url;
            const lrcFilePath = lrcFileUpload.secure_url;
            const songDuration = audioFileUpload.duration;

            const rawBody = req.body;
            const transformedTags = rawBody.tags
                ?.split(",")
                .map((tag:string) => tag.trim())
                .filter((tag: string) => tag.length > 0) || [];

            const validatedData = UploadSongRequestSchema.parse({
                title: rawBody.title,
                description: rawBody.description,
                genre: rawBody.genre,  
                tags: rawBody.tags,   
                songFilePath,
                audioPublicId: audioFileUpload.public_id,
                coverImagePath,
                coverImagePublicId: coverImageUpload.public_id,
                lrcFilePath,
                lyricsPublicId: lrcFileUpload.public_id,
                duration: songDuration
            });

            const dto: UploadSongDTO = {
                title: validatedData.title,
                description: validatedData.description,
                genre: validatedData.genre,           
                tags: transformedTags,                
                songFilePath: validatedData.songFilePath,
                audioPublicId: validatedData.audioPublicId,
                coverImagePath: validatedData.coverImagePath,
                coverImagePublicId: validatedData.coverImagePublicId,
                lrcFilePath: validatedData.lrcFilePath,
                lyricsPublicId: validatedData.lyricsPublicId,
                duration: validatedData.duration
            };

            await this.artistUploadSongUsecase.execute(artistId, dto);

            return res.status(StatusCode.CREATED).json({ message: "New Song uploaded successfully" });
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
            const result = await this.artistGetSongsUsecase.execute(artistId)

            return res.status(StatusCode.OK).json(result)
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

            await this.artistCreateAlbumUsecase.execute(artistId, dto)

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

           const response = await this.artistGetAlbumsUsecase.execute(artistId)
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

            const result =  await this.artistsongDetailsUsecase.execute(songId)

            return res.status(StatusCode.OK).json(result)
        } catch (error) {
            next(error)
        }
    }

    editSong = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { songId } = req.params;
            const artistId = req.user?.id;

            if (!artistId || !songId) {
                return res.status(StatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
            }

            const existingSong = await this.artistsongDetailsUsecase.execute(songId);
            if (!existingSong) {
                return res.status(StatusCode.NOT_FOUND).json({ message: "Song not found" });
            }
            // if (existingSong.artistId !== artistId) {
            //     return res.status(StatusCode.FORBIDDEN).json({ message: "Not authorized to edit this song" });
            // }

            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            const updateData: any = { ...req.body }; 

            // Transform tags if present
            if (updateData.tags) {
                updateData.tags = updateData.tags
                    .split(",")
                    .map((tag: string) => tag.trim())
                    .filter((tag: string) => tag.length > 0);
            }

            // Audio file update (optional)
            if (files['trackFile'] && files['trackFile'].length > 0) {
                const audioFile = files['trackFile'][0];
                const audioFileDataURL = `data:${audioFile.mimetype};base64,${audioFile.buffer.toString("base64")}`;

                const FileUploadOptions: uploadOptionsType = {
                    resource_type: "video",
                    public_id: existingSong.audioPublicId,
                    invalidate: true
                };

                const audioFileUpload = await cloudinary.uploader.upload(audioFileDataURL, FileUploadOptions);
                updateData.songFilePath = audioFileUpload.secure_url;
                updateData.audioPublicId = audioFileUpload.public_id;
                updateData.duration = audioFileUpload.duration;
            }

            // Cover image update (optional)
            if (files['coverImage'] && files['coverImage'].length > 0) {
                const coverImageFile = files['coverImage'][0];
                const coverImageDataURL = `data:${coverImageFile.mimetype};base64,${coverImageFile.buffer.toString("base64")}`;

                const UploadOption: uploadOptionsType = {
                    resource_type: "image",
                    public_id: existingSong.coverImagePublicId,
                    invalidate: true
                };

                const coverImageUpload = await cloudinary.uploader.upload(coverImageDataURL, UploadOption);
                updateData.coverImagePath = coverImageUpload.secure_url;
                updateData.coverImagePublicId = coverImageUpload.public_id;
            }

            // Lyrics file update (optional)
            if (files['lrcFile'] && files['lrcFile'].length > 0) {
                const lrcFile = files['lrcFile'][0];
                const lrcFileDataURL = `data:${lrcFile.mimetype};base64,${lrcFile.buffer.toString("base64")}`;

                const UploadOption: uploadOptionsType = {
                    resource_type: "raw",
                    public_id: existingSong.lyricsPublicId,
                    invalidate: true
                };

                const lrcFileUpload = await cloudinary.uploader.upload(lrcFileDataURL, UploadOption);
                updateData.lrcFilePath = lrcFileUpload.secure_url;
                updateData.lyricsPublicId = lrcFileUpload.public_id;
            }

            // Validate with Zod schema
            const validatedDto = EditSongRequestSchema.parse(updateData);
            await this.editSongUsecase.execute(songId, validatedDto);

            return res.status(StatusCode.OK).json({ message: "Song updated successfully" });
        } catch (error) {
            next(error);
        }
};


    getAlbumById = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const artistId = req.user?.id
            const albumId = req.params.albumId
            if(!artistId || !albumId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            const result =  await this.artistAlbumDetailsUsecase.execute(albumId)

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

            const existingAlbum = await this.getAlbumDetailsUsecase.execute(albumId)
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

            await this.artistEditAlbumUsecase.execute(artistId,albumId, dto)

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

            const result = await this.artistDeleteSongUsecase.execute(songId, artistId)
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

            const result = await this.artistDeleteAlbumUsecase.execute(albumId, artistId)
            return res.status(StatusCode.OK).json(result)
        } catch (error) {
            next(error)
        }
    }
}