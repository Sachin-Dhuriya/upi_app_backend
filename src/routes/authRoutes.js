import express from "express";
const router = express.Router();
import authController from '../controllers/authController.js'
import authenticate from "../middlewares/authMiddleware.js";

router.post('/register', authController.userRegister);
router.post('/login', authController.userLogin);
router.get('/profile',authenticate, authController.userProfile)

export default router;