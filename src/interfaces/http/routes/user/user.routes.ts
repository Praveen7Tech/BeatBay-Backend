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

    return router
}