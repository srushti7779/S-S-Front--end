import { Router } from 'express';
import { authenticateAdminUser } from '../../../../middlewares/verifyUsers';

import { storageAddonController } from '../../../controllers/apis/v1/storageAddon';

const router = Router();



router.get('/', storageAddonController.getStorageAddons)
router.get('/:id', storageAddonController.getStorageAddon)


router.use(authenticateAdminUser);
router.post("/", storageAddonController.createStorageAddons);
router.route('/:id').put(storageAddonController.updateStorageAddon).delete(storageAddonController.deleteStorageAddon);

// router.get('/user', authController.getUser);

export default router;