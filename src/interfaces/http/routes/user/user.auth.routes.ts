import { AwilixContainer } from "awilix"
import { Router } from "express"
import { UserController } from "../../controllers/user/user.controller"

export default (container: AwilixContainer): Router=> {
    const router = Router()
    const userController = container.resolve<UserController>('artistAuthController')

    router.post('/edit-profile', userController.editProfile)

    return router
}