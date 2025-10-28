import { AwilixContainer } from "awilix"
import { Router } from "express"
import { UserController } from "../../controllers/user/user.controller"
import { authMiddleware } from "../../../middleware/authMiddleware"
import { upload } from "../../../middleware/multer"

export default (container: AwilixContainer): Router=> {
    const router = Router()
    const userController = container.resolve<UserController>('userController')

    router.put('/edit-profile',authMiddleware, upload.single("profileImage"), userController.editProfile)

    return router
}