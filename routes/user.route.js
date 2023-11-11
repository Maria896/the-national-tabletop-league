import express from "express";
import {
  registerUser,
  verifyEmail,
  loginUser,
  googlelogin,
  forgotPassword,
  resetUserPassword,
  getAllUsers,
} from "../controllers/user.controller.js";
import { authHandler } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", loginUser);
router.post("/google-login", googlelogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetUserPassword);
router.get("/", authHandler, getAllUsers);

export default router;
