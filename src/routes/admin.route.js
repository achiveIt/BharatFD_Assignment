import { Router } from "express";
import { addFAQ } from "../controller/admin.controller.js";

const router = Router();

router.route('/addFaq').post(addFAQ);

export default router