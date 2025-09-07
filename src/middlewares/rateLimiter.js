import rateLimit from "express-rate-limit";

//to prevent brute-force attacks
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, 
  message: { message: "Too many login attempts. Please try again after 15 minutes." },
  standardHeaders: true, 
  legacyHeaders: false,
});

// Transaction limiter 
export const transactionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 5, 
  message: { message: "Too many transaction requests. Please slow down." },
  standardHeaders: true,
  legacyHeaders: false,
});
