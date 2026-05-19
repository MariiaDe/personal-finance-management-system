import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createBankAccount,
  deleteBankAccount,
  getBankAccounts,
  syncBankAccount
} from "../controllers/bankAccountController.js";

const router = express.Router();

router.get("/", authMiddleware, getBankAccounts);
router.post("/", authMiddleware, createBankAccount);
router.post("/:id/sync", authMiddleware, syncBankAccount);
router.delete("/:id", authMiddleware, deleteBankAccount);

export default router;
