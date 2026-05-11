
import { Router } from "express";
import { getNetwork, getSales, getPayouts, requestPayout, generateReferralCode } from "../controllers/reseller.controller.js";

const router = Router();

router.get("/reseller/network", getNetwork);
router.get("/reseller/sales", getSales);
router.get("/reseller/payouts", getPayouts);
router.post("/reseller/payouts", requestPayout);
router.post("/reseller/generate-code", generateReferralCode);

export default router;
