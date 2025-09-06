import express from "express";
const router = express.Router();
import bankController from "../controllers/bankController.js";
import authenticate from '../middlewares/authMiddleware.js'

router.post('/link',authenticate, bankController.addBankAccount)
router.get('/balance', authenticate, bankController.getAccountBalance)

export default router;