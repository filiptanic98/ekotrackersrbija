import { Router } from 'express';
import { createDump, getDumps } from '../controllers/dumps';

const router = Router();

router.post('/dumps', createDump);
router.get('/dumps', getDumps);

export default router;