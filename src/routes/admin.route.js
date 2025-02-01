import { Router } from "express";
import { addFAQ, deleteFAQ, editFAQ } from "../controller/admin.controller.js";

const router = Router();

router.route('/faq').post(addFAQ);

router.route('/faq/:id').delete(deleteFAQ);

router.route('/faq/:id').patch(editFAQ);

export default router