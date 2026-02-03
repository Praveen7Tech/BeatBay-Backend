 // upLoadSong = async (req: AuthRequest, res: Response, next: NextFunction) => {
    //     try {
    //         const artistId = req.user?.id;
    //         if (!artistId) {
    //             return res.status(StatusCode.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED });
    //         }

    //         const files = req.files as unknown as SongUploadFile

    //         if (!files['trackFile'] || !files['coverImage'] || !files['lrcFile']) {
    //             return res.status(400).json({ message: "Missing required files." });
    //         }

    //         const trackFile = files['trackFile'][0];
    //         const coverImageFile = files['coverImage'][0];
    //         const lrcFile = files['lrcFile'][0]; 

    //         // Cloudinary uploads 
    //         const coverImageUpload = await cloudinary.uploader.upload(
    //             `data:${coverImageFile.mimetype};base64,${coverImageFile.buffer.toString("base64")}`,
    //             { folder: `song/${artistId}/coverImage`, resource_type: "image" }
    //         );

    //         const audioFileUpload = await cloudinary.uploader.upload(
    //             `data:${trackFile.mimetype};base64,${trackFile.buffer.toString("base64")}`,
    //             { folder: `song/${artistId}/trackFile`, resource_type: "video" }
    //         );

    //         const lrcFileUpload = await cloudinary.uploader.upload(
    //             `data:${lrcFile.mimetype};base64,${lrcFile.buffer.toString("base64")}`,
    //             { folder: `song/${artistId}/lrcFile`, resource_type: "raw" }
    //         );

    //         const songFilePath = audioFileUpload.secure_url;
    //         const coverImagePath = coverImageUpload.secure_url;
    //         const lrcFilePath = lrcFileUpload.secure_url;
    //         const songDuration = audioFileUpload.duration;

    //         const rawBody = req.body;
    //         const transformedTags = rawBody.tags
    //             ?.split(",")
    //             .map((tag:string) => tag.trim())
    //             .filter((tag: string) => tag.length > 0) || [];

    //         const validatedData = UploadSongRequestSchema.parse({
    //             title: rawBody.title,
    //             description: rawBody.description,
    //             genre: rawBody.genre,  
    //             tags: rawBody.tags,   
    //             songFilePath,
    //             audioPublicId: audioFileUpload.public_id,
    //             coverImagePath,
    //             coverImagePublicId: coverImageUpload.public_id,
    //             lrcFilePath,
    //             lyricsPublicId: lrcFileUpload.public_id,
    //             duration: songDuration
    //         });

    //         const dto: UploadSongDTO = {
    //             title: validatedData.title,
    //             description: validatedData.description,
    //             genre: validatedData.genre,           
    //             tags: transformedTags,                
    //             songFilePath: validatedData.songFilePath,
    //             audioPublicId: validatedData.audioPublicId,
    //             coverImagePath: validatedData.coverImagePath,
    //             coverImagePublicId: validatedData.coverImagePublicId,
    //             lrcFilePath: validatedData.lrcFilePath,
    //             lyricsPublicId: validatedData.lyricsPublicId,
    //             duration: validatedData.duration
    //         };

    //         await this._artistUploadSongUsecase.execute(artistId, dto);

    //         return res.status(StatusCode.CREATED).json({ message: "New Song uploaded successfully" });
    //     } catch (error) {
    //         next(error);
    //     }
    // };


    //////////////////////////

     // editSong = async (req: AuthRequest, res: Response, next: NextFunction) => {
        //     try {
        //         const { songId } = req.params;
        //         const artistId = req.user?.id;
    
        //         if (!artistId || !songId) {
        //             return res.status(StatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
        //         }
    
        //         const existingSong = await this._artistsongDetailsUsecase.execute(songId);
        //         if (!existingSong) {
        //             return res.status(StatusCode.NOT_FOUND).json({ message: "Song not found" });
        //         }
    
        //         const files = req.files as unknown as SongUploadFile
        //         const updateData = { ...req.body }; 
    
        //         // Transform tags if present
        //         if (updateData.tags) {
        //             updateData.tags = updateData.tags
        //                 .split(",")
        //                 .map((tag: string) => tag.trim())
        //                 .filter((tag: string) => tag.length > 0);
        //         }
    
        //         // Audio file update (optional)
        //          const trackFile = files.trackFile?.[0];
        //         if (trackFile) {
        //             const audioFileDataURL = `data:${trackFile.mimetype};base64,${trackFile.buffer.toString("base64")}`;
        //             const FileUploadOptions: uploadOptionsType = {
        //                 resource_type: "video",
        //                 public_id: existingSong.audioPublicId,
        //                 invalidate: true
        //             };
        //             const audioFileUpload = await cloudinary.uploader.upload(audioFileDataURL, FileUploadOptions);
        //             updateData.songFilePath = audioFileUpload.secure_url;
        //             updateData.audioPublicId = audioFileUpload.public_id;
        //             updateData.duration = audioFileUpload.duration;
        //         }
    
        //         // Cover Image Update
        //         const coverImageFile = files.coverImage?.[0];
        //         if (coverImageFile) {
        //             const coverImageDataURL = `data:${coverImageFile.mimetype};base64,${coverImageFile.buffer.toString("base64")}`;
        //             const UploadOption: uploadOptionsType = {
        //                 resource_type: "image",
        //                 public_id: existingSong.coverImagePublicId,
        //                 invalidate: true
        //             };
        //             const coverImageUpload = await cloudinary.uploader.upload(coverImageDataURL, UploadOption);
        //             updateData.coverImagePath = coverImageUpload.secure_url;
        //             updateData.coverImagePublicId = coverImageUpload.public_id;
        //         }
    
        //         // Lyrics File Update
        //         const lrcFile = files.lrcFile?.[0];
        //         if (lrcFile) {
        //             const lrcFileDataURL = `data:${lrcFile.mimetype};base64,${lrcFile.buffer.toString("base64")}`;
        //             const UploadOption: uploadOptionsType = {
        //                 resource_type: "raw",
        //                 public_id: existingSong.lyricsPublicId,
        //                 invalidate: true
        //             };
        //             const lrcFileUpload = await cloudinary.uploader.upload(lrcFileDataURL, UploadOption);
        //             updateData.lrcFilePath = lrcFileUpload.secure_url;
        //             updateData.lyricsPublicId = lrcFileUpload.public_id;
        //         }
    
        //         // Validate with Zod schema
        //         const validatedDto = EditSongRequestSchema.parse(updateData);
        //         await this._editSongUsecase.execute(songId, validatedDto);
    
        //         return res.status(StatusCode.OK).json({ message: "Song updated successfully" });
        //     } catch (error) {
        //         next(error);
        //     }
        // };
    