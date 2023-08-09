import { Router } from 'express';
import { authenticateUser } from '../../../../middlewares/verifyUsers';

import { folderController } from '../../../controllers/apis/v1/folders';

const router = Router();


router.use(authenticateUser);
router.route('/').get(folderController.getFolders).post(folderController.createFolder);
router.route('/:id').get(folderController.getFolder).put(folderController.updateFolder).delete(folderController.deleteFolder);

// router.get('/user', authController.getUser);

export default router;