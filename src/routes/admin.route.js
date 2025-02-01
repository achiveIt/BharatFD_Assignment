import { Router } from "express";
import { addFAQ, deleteFAQ } from "../controller/admin.controller.js";

const router = Router();

router.route('/faq').post(addFAQ);

router.route('/faq/:id').delete(deleteFAQ);

export default router