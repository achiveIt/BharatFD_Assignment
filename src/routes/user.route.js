import {Router} from 'express';
import {getFAQs} from '../controller/user.controller.js';

const router = Router();

router.route('/faq').get(getFAQs);

export default router;
