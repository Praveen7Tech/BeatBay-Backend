import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../../../middleware/auth/authMiddleware";
import { StatusCode } from "../../../../common/constants/status.enum";
import { MESSAGES } from "../../../../common/constants/constants.message";
import { ArtistEditProfileUsecase } from "../../../../usecases/artist/profile/artistEditProfile.useCase";
import { ChangePasswordRequestDTO, EditProfileRequestDTO } from "../../../../usecases/dto/profile/profile.dto";
import { ChangePasswordSchema, EditProfileSchema } from "../../validators/profile/profile.validators";
import { ArtistChangePasswordUsecase } from "../../../../usecases/artist/profile/artistChangePassword.useCase";
import { UploadSongDTO } from "../../../../usecases/dto/song/song.dto";
import { UploadSongRequestSchema } from "../../validators/song/song.validator";
import { UploadSongUseCase } from "../../../../usecases/artist/song/uploadSong.useCase";
import { GetSongsUseCase } from "../../../../usecases/artist/song/getSongs.useCase";
import { ArtistCreateAlbumUseCase } from "../../../../usecases/artist/album/createAlbums.useCase";
import { CreateAlbumDTO } from "../../../../usecases/dto/album/album.dto";
import { CreateAlbumRequestSchema, EditAlbumRequestSchema } from "../../validators/album/album.validator";
import { artistGetAlbumsUseCase } from "../../../../usecases/artist/album/artistGetAlbums.useCase";

import ffprobe from 'ffprobe';
import ffprobeStatic from 'ffprobe-static';
import { GetSongDetailsByIdUseCase } from "../../../../usecases/artist/song/getSongById.useCase";
import { EditSongUseCase } from "../../../../usecases/artist/song/editSong.useCase";
import { GetAlbumDetailsByIdUseCase } from "../../../../usecases/artist/album/getAlbumDetailsById.useCase";
import { EditAlbumUseCase } from "../../../../usecases/artist/album/artistEditAlbum.useCase";
import { DeleteSongUseCase } from "../../../../usecases/artist/song/deleteSong.useCase";
import { DeleteAlbumUsecase } from "../../../../usecases/artist/album/artistDeleteAlbum.useCase";
import cloudinary from "../../../../infrastructure/config/cloudinary";
import logger from "../../../../infrastructure/utils/logger/logger";

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
        private readonly artistDeleteAlbumUsecase: DeleteAlbumUsecase
    ){}

    editProfile = async(req:AuthRequest, res:Response, next: NextFunction)=>{
        try {
            const artistId = req.user?.id
            if(!artistId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }

            let profileImageUrl : string | undefined;
            
            if(req.file){
                const dataURL = `data:${req.file.mimetype}:base64,${req.file.buffer.toString("base64")}`;

                const uploadImage = await cloudinary.uploader.upload(dataURL,{
                    folder: `artist_profile/${artistId}`,
                    resource_type: 'image'
                })

                profileImageUrl = uploadImage.secure_url;
            }
            logger.info("artistId r")
            const dto : EditProfileRequestDTO = EditProfileSchema.parse({...req.body, profileImage: profileImageUrl}) 
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
    
    upLoadSong = async(req:AuthRequest, res:Response, next:NextFunction)=>{
        try {
            const artistId = req.user?.id
            if(!artistId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: MESSAGES.UNAUTHORIZED})
            }
            
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            if (!files['trackFile'] || !files['coverImage']) {
                return res.status(400).json({ message: "Missing required files." });
            }

            const songFilePath = files["trackFile"][0].filename
            const coverImagePath = files["coverImage"][0].filename
            const lrcFilePath = files["lrcFile"][0].filename

            const filePath = files['trackFile'][0].path
            let songDuration : string | undefined

            try {
                const info = await ffprobe(filePath, {path:ffprobeStatic.path})
                songDuration = info.streams[0].duration
                
            } catch (error) {
                console.error("Error determining song duration with ffprobe:", error);
            }

            const dto : UploadSongDTO = UploadSongRequestSchema.parse({...req.body, songFilePath, coverImagePath, lrcFilePath, duration:songDuration})

            await this.artistUploadSongUsecase.execute(artistId,dto)

            return res.status(StatusCode.CREATED).json({message:"New Song uploaded successfully"})
        } catch (error) {
            next(error)
        }
    }

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
            if(req.file){
                coverImageUrl = req.file.filename
            }

            const dto: CreateAlbumDTO = CreateAlbumRequestSchema.parse({...req.body, coverImageUrl: coverImageUrl})

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

     editSong = async(req: AuthRequest, res: Response, next: NextFunction)=>{
        try {
            const { songId } = req.params;
            const artistId = req.user?.id; 

            if(!artistId || !songId){
                return res.status(StatusCode.UNAUTHORIZED).json({message: "Unauthorized"})
            }
            
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            
            const updateData: Partial<UploadSongDTO> = {...req.body};

            if (files['trackFile'] && files['trackFile'].length > 0) {
                updateData.songFilePath = files['trackFile'][0].filename;
                const filePath = files['trackFile'][0].path;
                try {
                    const info = await ffprobe(filePath, {path:ffprobeStatic.path});
                    updateData.duration = info.streams[0].duration;
                } catch (error) {
                    console.error("Error determining new song duration:", error);
                }
            }
            if (files['coverImage'] && files['coverImage'].length > 0) {
                updateData.coverImagePath = files['coverImage'][0].filename;
            }
            if (files['lrcFile'] && files['lrcFile'].length > 0) {
                updateData.lrcFilePath = files['lrcFile'][0].filename;
            }

            await this.editSongUsecase.execute(songId, updateData); 

            return res.status(StatusCode.OK).json({message:"Song updated successfully"});
        } catch (error) {
            next(error);
        }
    }

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

            const dto : Partial<CreateAlbumDTO>= EditAlbumRequestSchema.parse({...req.body})
            
            let coverImageUrl: string | undefined = undefined;
            if (req.file?.filename) {
                dto.coverImageUrl = req.file.filename; 
            }

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