import {Router} from 'express';
import {getFAQs} from '../controller/user.controller.js';

const router = Router();

router.route('/faq/:lang').get(getFAQs);

export default router;
