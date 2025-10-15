import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AwilixContainer } from 'awilix';

export default (container: AwilixContainer): Router => {
  const router = Router();
  const authController = container.resolve<AuthController>('authController');

  router.post('/signup', (req, res) => authController.signup(req, res));
  router.post('/verify-otp', (req, res) => authController.verifyOtp(req, res));
  router.post('/resend-otp', (req,res) => authController.resendOtp(req, res))
  // Add other routes here, e.g., login, resend-otp
  return router;
};
