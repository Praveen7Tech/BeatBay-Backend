import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { SignupUsecase } from "../../../usecases/auth/signup.useCase";
import { MongooseUserRepository } from "../../../infrastructure/presistence/mongoose/repositories/mongoose.user.repository";

const mongoUserRepository = new MongooseUserRepository()
const signupUsecase = new SignupUsecase(mongoUserRepository)
const authController = new AuthController(signupUsecase)

const authRouter = Router()

authRouter.post("/signup", (req,res)=> authController.signup(req,res))

export default authRouter