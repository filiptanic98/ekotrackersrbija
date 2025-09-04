import { Router } from 'express';
import { createMunicipality, getMunicipalities } from '../controllers/municipalities';

const router = Router();

router.post('/municipalities', createMunicipality);
router.get('/municipalities', getMunicipalities);

export default router;