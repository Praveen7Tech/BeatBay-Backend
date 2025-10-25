import { AwilixContainer } from "awilix";
import { Router } from "express";
import { artistAuthController } from "../../controllers/artist/artist.auth.controller";

export default (container: AwilixContainer): Router=> {
    const router = Router()
    const artistAuthController = container.resolve<artistAuthController>('artistAuthController')

    router.post('/signup', artistAuthController.signUp)
    router.post('/verify-otp', artistAuthController.verifyOtp)
    router.post('/resend-otp', artistAuthController.resendOTP)
    router.post('/login', artistAuthController.login)
    router.post('/logout', artistAuthController.logOut)

    return router
}