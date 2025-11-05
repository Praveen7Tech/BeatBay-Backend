import { AwilixContainer } from "awilix";
import { Router } from "express";
import { artistAuthController } from "../../controllers/artist/artist.auth.controller";
import { ArtistController } from "../../controllers/artist/artist.controller";
import { authMiddleware } from "../../../middleware/authMiddleware";
import { upload } from "../../../middleware/multer";

export default (container: AwilixContainer): Router=> {
    const router = Router()
    const artistAuthController = container.resolve<artistAuthController>('artistAuthController')
    const artistController = container.resolve<ArtistController>('artistController')

    router.post('/signup', artistAuthController.signUp)
    router.post('/verify-otp', artistAuthController.verifyOtp)
    router.post('/resend-otp', artistAuthController.resendOTP)
    router.post('/login', artistAuthController.login)
    router.post('/logout', artistAuthController.logOut)
    router.post('/google-signup', artistAuthController.googleSignup)

    router.put('/edit-profile',authMiddleware, upload.single("profileImage"), artistController.editProfile)
    router.post('/verify-email', artistController.verifyEmail)
    router.put('/reset-password', artistController.resetPassword)

    return router
}