import express from "express";
const router = express.Router();

import {
  processPayment,
  sendApiKey,
  paymentVerification,
} from "../controller/payment.controller.js";
import { verifyUserAuth } from "../middleware/auth.middleware.js";

router.route("/order").post(verifyUserAuth, processPayment);
router.route("/getKey").get(verifyUserAuth, sendApiKey);
router.route("/verification").post(paymentVerification);

export default router;
