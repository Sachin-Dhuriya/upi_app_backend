import express from "express";
const router = express.Router();
import transactionController from "../controllers/transactionController.js";
import authenticate from "../middlewares/authMiddleware.js"
import { transactionLimiter } from "../middlewares/rateLimiter.js"


router.post("/send", authenticate, transactionController.sendMoney)
router.post('/request', authenticate,transactionLimiter, transactionController.requestMoney)
router.get('/request/received', authenticate, transactionController.listOfRequestReceived)
router.get('/request/send', authenticate, transactionController.listOfRequestSend)
router.post('/respond', authenticate,transactionLimiter, transactionController.respondTransactionRequest)
router.get('/history', authenticate, transactionController.transactionHistory)
router.get("/status/:id", authenticate, transactionController.getTransactionStatus);

export default router;