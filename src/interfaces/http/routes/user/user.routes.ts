import { AwilixContainer } from "awilix"
import { Router } from "express"
import { UserController } from "../../controllers/user/user.controller"
import { authMiddleware } from "../../../middleware/auth/authMiddleware"
import { upload } from "../../../middleware/uploads/multer"
import { PlayList } from "../../../middleware/playlist/editPlayList.Middleware"
import { statusCheckMiddleware } from "../../../middleware/status/statusCheckMiddleware"

export default (container: AwilixContainer): Router=> {
    const router = Router()
    const userController = container.resolve<UserController>('userController')

    router.use(authMiddleware, statusCheckMiddleware)

    router.put('/edit-profile', upload.single("profileImage"), userController.editProfile)
    router.put('/change-password', userController.changePassword)
    router.get('/fetch-songs', userController.fetchSongs)
    router.get('/fetch-albums', userController.fetchAlbums)

    router.get('/song-details/:id', userController.songDetails)
    router.get('/album-details/:id', userController.albumDetails)

    router.get('/artist-details/:id', userController.artistDetails)
    router.get('/is-following/:artistId', userController.checkFollowStatus)
    router.post('/follow/:artistId', userController.followArtist)
    router.delete('/follow/:artistId', userController.unFollowArtist)
    router.get('/following', userController.following)

    router.post('/create-playlist', userController.createPlayList)
    router.get('/get-playlist/:playListId', userController.getPlayList)
    router.get('/get-user-playlist', userController.getAllPlaylists)
    router.post('/addTo-playList/:playListId', userController.addToPlayList)
    router.post('/edit-playList/:playListId', PlayList.single("coverImage"), userController.editPlayList)

    router.get('/searchSong', userController.searchSongs)

    return router
}