import express from "express";
import {createTransaction, getTransactionSummary, getTransactionsByUser, deleteTransaction} from "../Controller/transactionsController.js";
const router = express.Router();

router.post("/", createTransaction);
router.get("/summary/:userId", getTransactionSummary);
router.get("/:userId", getTransactionsByUser);
router.delete("/:id", deleteTransaction);
export default router;