import { AwilixContainer } from "awilix";
import { Router } from "express";
import { AdminFeaturesController } from "../../controllers/admin/adminFeatures.controller";
import { authMiddleware } from "../../../middleware/auth/authMiddleware";
import { route } from "awilix-express";
import { authorizeRoles } from "../../../middleware/auth/autharizeRole.middleware";


export default (container: AwilixContainer): Router=>{
    const router = Router()

    const adminFeaturesController = container.resolve<AdminFeaturesController>('adminFeaturesController');

    router.use(authMiddleware, authorizeRoles("admin"))

    router.get('/fetch-allusers',  adminFeaturesController.getAllUser)
    router.get('/get-userById/:userId',  adminFeaturesController.getUserById)
    router.put('/block-user/:userId',  adminFeaturesController.blockUser)
    router.put('/unBlock-user/:userId',  adminFeaturesController.unBlockUser)

    router.get('/fetch-allArtist',  adminFeaturesController.getAllArtists)
    router.get('/get-artistById/:artistId',  adminFeaturesController.getArtistById)
    router.put('/block-artist/:artistId',  adminFeaturesController.blockArtist)
    router.put('/unBlock-artist/:artistId',  adminFeaturesController.unBlockArtist)

    router.get('/get-dashboard-data',  adminFeaturesController.getDadhBoradDara)
    router.get('/get-allsongs', adminFeaturesController.getAllSongs)
    router.get('/get-songbyid/:id', adminFeaturesController.getSongDetails)
    router.put('/song/:id/status', adminFeaturesController.toggleSongBlockStatus);

    return router
}