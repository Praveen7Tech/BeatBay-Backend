import { AwilixContainer } from "awilix";
import { Router } from "express";
import { AdminFeaturesController } from "../../controllers/admin/adminFeatures.controller";
import { authMiddleware } from "../../../middleware/auth/authMiddleware";
import { route } from "awilix-express";


export default (container: AwilixContainer): Router=>{
    const router = Router()

    const adminFeaturesController = container.resolve<AdminFeaturesController>('adminFeaturesController');

    router.get('/fetch-allusers', authMiddleware, adminFeaturesController.getAllUser)
    router.get('/get-userById/:userId', authMiddleware, adminFeaturesController.getUserById)
    router.put('/block-user/:userId', authMiddleware, adminFeaturesController.blockUser)
    router.put('/unBlock-user/:userId', authMiddleware, adminFeaturesController.unBlockUser)

    router.get('/fetch-allArtist', authMiddleware, adminFeaturesController.getAllArtists)
    router.get('/get-artistById/:artistId', authMiddleware, adminFeaturesController.getArtistById)
    router.put('/block-artist/:artistId', authMiddleware, adminFeaturesController.blockArtist)
    router.put('/unBlock-artist/:artistId', authMiddleware, adminFeaturesController.unBlockArtist)

    return router
}