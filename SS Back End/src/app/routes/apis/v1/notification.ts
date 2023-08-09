import { Router } from 'express';
import { authenticateUser } from '../../../../middlewares/verifyUsers';

import { notificationController } from '../../../controllers/apis/v1/notification';

const router = Router();


router.use(authenticateUser);
router.route('/').get(notificationController.getNotifications)
// router.get('/user', authController.getUser);

export default router;