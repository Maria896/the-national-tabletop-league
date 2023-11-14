import express from "express";
import {
  registerUser,
  verifyEmail,
  loginUser,
  googlelogin,
  forgotPassword,
  resetUserPassword,
  getAllUsers,
  updateUser,
} from "../controllers/user.controller.js";
import { authHandler } from "../middleware/auth.middleware.js";
import { upload } from "../utils/image.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", loginUser);
router.post("/google-login", googlelogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetUserPassword);
router.get("/users", authHandler, getAllUsers);
router.put(
  "/edit-profile/:id",
  authHandler,
  upload.single("profileImage"),
  updateUser
);

export default router;
