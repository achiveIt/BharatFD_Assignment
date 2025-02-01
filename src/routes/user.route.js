import {Router} from 'express';
import getAllFAQs from '../controller/user.controller.js';

const router = Router();

router.route('/faq').get(getAllFAQs);

export default router;
