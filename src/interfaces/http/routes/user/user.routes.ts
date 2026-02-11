import { AwilixContainer } from "awilix"
import { Router } from "express"
import { UserController } from "../../controllers/user/user.controller"
import { authMiddleware } from "../../../middleware/auth/authMiddleware"
import { statusCheckMiddleware } from "../../../middleware/status/statusCheckMiddleware"
import { uploadImage } from "../../../middleware/uploads/uploadImage"
import { authorizeRoles } from "../../../middleware/auth/autharizeRole.middleware"

export default (container: AwilixContainer): Router=> {
    const router = Router()
    const userController = container.resolve<UserController>('userController')

    router.use(authMiddleware,authorizeRoles("user"), statusCheckMiddleware)

    router.put('/edit-profile', uploadImage.single("profileImage"), userController.editProfile)
    router.put('/change-password', userController.changePassword)
    router.get('/fetch-songs', userController.fetchSongs)
    router.get('/fetch-albums', userController.fetchAlbums)

    router.get('/song-hydration/:id', userController.songDetails)

    router.get('/song-details/:id', userController.songDetails)
    router.get('/album-details/:id', userController.albumDetails)

    router.get('/artist-details/:id', userController.artistDetails)
    router.get('/is-following/:targetId', userController.checkFollowStatus)
    router.post('/follow/:targetId', userController.handleFollow)
    router.delete('/follow/:targetId', userController.handleFollow)
    router.get('/following', userController.following)

    router.get('/followers', userController.followers)

    router.post('/create-playlist', userController.createPlayList)
    router.get('/get-playlist/:playListId', userController.getPlayList)
    router.get('/get-user-playlist', userController.getAllPlaylists)
    router.post('/addTo-playList/:playListId', userController.addToPlayList)
    router.delete('/playlist/:playlistId/song/:songId', userController.removeFromPlaylist)
    router.post('/edit-playList/:playListId', uploadImage.single("coverImage"), userController.editPlayList)
    router.delete('/playlist/:playlistId/delete', userController.deletePlayList)

    router.get('/searchSong', userController.searchSongs)
    router.get('/search', userController.searchDiscover)

    router.get('/user-details/:userId', userController.userDetails)
    router.get('/friends', userController.friends)

    router.get('/songs', userController.allSongs)
    router.get('/albums', userController.allAlbums);

    router.put('/song/:songId/toggle-like', userController.toggleLike)

    router.get('/liked-songs', userController.LikedSongs)

    router.post('/subscription/checkout', userController.SubcriptionCheckout)
    router.get('/subscription', userController.subscription)
    router.put('/auto-subscription-toggle', userController.autoSubscriptionToggle)
    router.post('/subscription/cancel', userController.cancelSubscription)
    router.get('/subscription/history', userController.subscriptionHistory)
    router.post('/upgrade-subscription', userController.upgradeSubscriptionCheckout)

    router.post('/song/track-play', userController.trackSongPlay)
    router.post('/get-prices', userController.getPrices)

    return router
}