import { AwilixContainer } from "awilix";
import { Router } from "express";
import { artistAuthController } from "../../controllers/artist/artist.auth.controller";
import { ArtistController } from "../../controllers/artist/artist.controller";
import { authMiddleware } from "../../../middleware/auth/authMiddleware";
import { upload } from "../../../middleware/uploads/multer";
import { uploadSongMiddleware } from "../../../middleware/song/uploadSondMiddleware";
import { CreateAlbumMiddleware } from "../../../middleware/album/createAlbum.Middleware";
import { ArtistStatusCheckMiddleware } from "../../../middleware/status/artsitStatusCheckMiddleware"; 

export default (container: AwilixContainer): Router=> {
    const router = Router()

    const artistController = container.resolve<ArtistController>('artistController')

    router.use(authMiddleware, ArtistStatusCheckMiddleware)

    router.put('/edit-profile', upload.single("profileImage"), artistController.editProfile)
    router.put('/change-password', artistController.changePassword)

    router.post('/upload-song',  uploadSongMiddleware, artistController.upLoadSong)
    router.get('/fetch-songs',  artistController.fetchSongs)
    router.post('/create-album', CreateAlbumMiddleware.single("coverImageUrl"), artistController.createAlbum)
    router.get('/fetch-albums', artistController.fetchAlbums)
    router.get('/get-song/:songId', artistController.getSongById)

    router.put('/edit-song/:songId', uploadSongMiddleware, artistController.editSong )
    router.delete('/delete-song/:songId', artistController.deleteSong)

    router.get('/get-album/:albumId', artistController.getAlbumById)
    router.put('/edit-album/:albumId', CreateAlbumMiddleware.single("coverImageUrl"), artistController.editAlbum)
    router.delete('/delete-album/:albumId', artistController.deleteAlbum)

    return router
}
