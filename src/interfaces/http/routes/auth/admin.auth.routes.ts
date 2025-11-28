import { AwilixContainer } from "awilix";
import { Router } from "express";
import { AdminAuthController } from "../../controllers/admin/admin.auth.controller";


export default (container: AwilixContainer): Router =>{
    const router = Router()
    const adminAuthController = container.resolve<AdminAuthController>('adminAuthController');

    router.post('/login', (req,res, next)=> adminAuthController.login(req,res, next))
    router.post('/logout', (req,res,next) => adminAuthController.logout(req,res, next))

    return router
}

