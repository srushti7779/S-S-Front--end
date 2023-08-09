import { Router } from 'express';
import { uploadFile } from '../../../../config';
import { authenticateUser } from '../../../../middlewares/verifyUsers';

import { buddyController } from '../../../controllers/apis/v1/buddies';

const router = Router();

router.use(authenticateUser);
router.route('/').get(buddyController.getBuddies).post(buddyController.addBuddy);
router.post('/delete', buddyController.deleteBuddy);
router.post('/create', buddyController.acceptBuddy);
router.route('/:id').get(buddyController.getBuddy).put(buddyController.updateBuddy)



// router.get('/user', authController.getUser);

export default router;