import express from "express";
const router = express.Router();
import authController from '../controllers/authController.js'
import authenticate from "../middlewares/authMiddleware.js";
import { loginLimiter } from "../middlewares/rateLimiter.js";

router.post('/register', authController.userRegister);
router.post('/login',loginLimiter, authController.userLogin);
router.get('/profile',authenticate, authController.userProfile)

export default router;