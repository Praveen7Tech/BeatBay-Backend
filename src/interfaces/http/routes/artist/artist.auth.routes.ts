import { AwilixContainer } from "awilix";
import { Router } from "express";
import { artistAuthController } from "../../controllers/artist/artist.auth.controller";

export default (container: AwilixContainer): Router=> {
    const router = Router()
    const artistAuthController = container.resolve<artistAuthController>('artistAuthController')

    router.post('/signup', artistAuthController.signUp)

    return router
}