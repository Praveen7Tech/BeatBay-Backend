import { AwilixContainer } from "awilix";
import { Router } from "express";
import { AdminFeaturesController } from "../../controllers/admin/adminFeatures.controller";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { route } from "awilix-express";


export default (container: AwilixContainer): Router=>{
    const router = Router()

    const adminFeaturesController = container.resolve<AdminFeaturesController>('adminFeaturesController');

    router.get('/fetch-allusers', authMiddleware, adminFeaturesController.getAllUser)
    router.get('/get-userById/:userId', authMiddleware, adminFeaturesController.getUserById)
    router.put('/block-user/:userId', authMiddleware, adminFeaturesController.blockUser)

    return router
}