import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AwilixContainer } from 'awilix';
import { authMiddleware } from '../../middleware/authMiddleware';

export default (container: AwilixContainer): Router => {
  const router = Router();
  const authController = container.resolve<AuthController>('authController');

  router.post('/signup', (req, res, next) => authController.signup(req, res, next));
  router.post('/verify-otp', (req, res, next) => authController.verifyOtp(req, res, next));
  router.post('/resend-otp', (req,res, next) => authController.resendOtp(req, res, next))
  router.post('/login', (req,res, next) => authController.login(req, res, next))
  router.get('/check-auth-status',authMiddleware, (req,res, next)=> authController.authStatus(req,res, next))
  router.post('/refresh-token',(req,res, next) => authController.refreshToken(req,res, next))
  router.post('/logout' , (req,res, next) => authController.logout(req,res, next))
  return router;
};
