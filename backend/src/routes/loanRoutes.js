import express from "express";
import {
  applyForLoan,
  getMyLoans,
  getLoanDetails,
  updateLoanStatus,
  getRepaymentSchedule,
  payLoanInstallment
} from "../controllers/loanController.js";
import {authMiddleware} from "../middleWare/authMiddleware.js";
import adminMiddleware from "../middleWare/adminMiddleWare.js";

const router = express.Router();


router.post("/apply", authMiddleware, applyForLoan);
router.get("/myloans", authMiddleware, getMyLoans);
router.get("/:id", authMiddleware, getLoanDetails);
router.patch("/:id/status", authMiddleware, adminMiddleware, updateLoanStatus);
router.get("/:id/repayments", authMiddleware, getRepaymentSchedule);
// Add this new route
router.post("/:id/pay", authMiddleware, payLoanInstallment);

export default router;