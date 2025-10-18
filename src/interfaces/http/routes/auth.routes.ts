import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AwilixContainer } from 'awilix';
import { authMiddleware } from '../../middleware/authMiddleware';

export default (container: AwilixContainer): Router => {
  const router = Router();
  const authController = container.resolve<AuthController>('authController');

  router.post('/signup', (req, res) => authController.signup(req, res));
  router.post('/verify-otp', (req, res) => authController.verifyOtp(req, res));
  router.post('/resend-otp', (req,res) => authController.resendOtp(req, res))
  router.post('/login', (req,res) => authController.login(req, res))
  router.get('/check-auth-status', (req,res)=> authController.authStatus(req,res))
  router.post('/refresh-token',authMiddleware, (req,res) => authController.refreshToken(req,res))
  router.post('/logout',authMiddleware , (req,res) => authController.logout(req,res))
  return router;
};
