import { Router } from 'express';
import { ApplianceController } from '../controllers/applianceController';
import { 
  validateBody, 
  validateQuery,
  createApplianceSchema,
  updateApplianceSchema,
  queryParamsSchema 
} from '../middleware/validation';

const router = Router();
const applianceController = new ApplianceController();

router.get('/stats', applianceController.getStatistics);
router.get('/', validateQuery(queryParamsSchema), applianceController.getAllAppliances);
router.get('/:id', applianceController.getApplianceById);
router.post('/', validateBody(createApplianceSchema), applianceController.createAppliance);
router.put('/:id', validateBody(updateApplianceSchema), applianceController.updateAppliance);
router.delete('/:id', applianceController.deleteAppliance);

export default router;