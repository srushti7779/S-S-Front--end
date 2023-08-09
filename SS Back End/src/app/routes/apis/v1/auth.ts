import { Router } from 'express';

import { authController } from '../../../controllers/apis/v1/auth';

const router = Router();


router.post('/login', authController.login);
router.post('/login-google', authController.loginWithGoogle);
router.post('/login-admin', authController.loginAdmin);
router.post('/register', authController.register);
router.post('/register-admin', authController.registerAdmin);
router.post('/2fa', authController.twoFactorAuth);
router.post('/resend', authController.resendCode);
router.post('/forgot-password', authController.sendForgotPasswordOTP);
router.post('/change-password', authController.changePassword);


// router.get('/user', authController.getUser);

export default router;