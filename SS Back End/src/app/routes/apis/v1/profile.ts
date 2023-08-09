import { Router } from 'express';
import { uploadFile } from '../../../../config';
import { authenticateUser } from '../../../../middlewares/verifyUsers';

import { profileController } from '../../../controllers/apis/v1/profile';

const router = Router();


router.use(authenticateUser);
router.route('/')
    .get(profileController.find)
    .post(uploadFile.single('file'), profileController.create)
    .put(uploadFile.single('file'), profileController.update);


// router.get('/user', authController.getUser);

export default router;