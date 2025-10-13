import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { SignupUsecase } from "../../../usecases/auth/signup.useCase";
import { MongooseUserRepository } from "../../../infrastructure/presistence/mongoose/repositories/mongoose.user.repository";
import { RedisCacheServive } from "../../../infrastructure/presistence/services/redis-cache.service";

const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  // Create dependencies inside the route handler, AFTER Redis is connected
  const mongoUserRepository = new MongooseUserRepository();
  const redisCacheServive = new RedisCacheServive();
  const signupUsecase = new SignupUsecase(mongoUserRepository, redisCacheServive);
  const authController = new AuthController(signupUsecase);

  await authController.signup(req, res);
});

export default authRouter;
