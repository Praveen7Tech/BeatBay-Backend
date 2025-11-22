import { AwilixContainer } from "awilix"
import { Router } from "express"
import { UserController } from "../../controllers/user/user.controller"
import { authMiddleware } from "../../../middleware/authMiddleware"
import { upload } from "../../../middleware/multer"

export default (container: AwilixContainer): Router=> {
    const router = Router()
    const userController = container.resolve<UserController>('userController')

    router.put('/edit-profile',authMiddleware, upload.single("profileImage"), userController.editProfile)
    router.put('/change-password', authMiddleware, userController.changePassword)
    router.get('/fetch-songs', authMiddleware, userController.fetchSongs)
    router.get('/fetch-albums', authMiddleware, userController.fetchAlbums)

    router.get('/song-details/:id', authMiddleware, userController.songDetails)
    router.get('/album-details/:id', authMiddleware, userController.albumDetails)

    router.get('/artist-details/:id', authMiddleware, userController.artistDetails)
    router.get('/is-following/:artistId', authMiddleware, userController.checkFollowStatus)
    router.post('/follow/:artistId', authMiddleware, userController.followArtist)
    router.delete('/follow/:artistId', authMiddleware, userController.unFollowArtist)
    router.get('/following', authMiddleware, userController.following)

    router.post('/create-playlist', authMiddleware, userController.createPlayList)
    router.get('/playList-details/:playListId', authMiddleware, userController.getPlayList)
    router.get('/get-playlist', authMiddleware, userController.getAllPlaylists)
    router.post('/addTo-playList/:playListId', authMiddleware, userController.addToPlayList)

    return router
}