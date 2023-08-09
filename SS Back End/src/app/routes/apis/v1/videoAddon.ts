import { Router } from 'express';
import { authenticateAdminUser } from '../../../../middlewares/verifyUsers';

import { videoAddonController } from '../../../controllers/apis/v1/videoAddon';

const router = Router();



router.get('/', videoAddonController.getVideoAddons)
router.get('/:id', videoAddonController.getVideoAddon)


router.use(authenticateAdminUser);
router.post("/", videoAddonController.createVideoAddons);
router.route('/:id').put(videoAddonController.updateVideoAddon).delete(videoAddonController.deleteVideoAddon);

// router.get('/user', authController.getUser);

export default router;