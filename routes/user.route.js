import express from "express";
import {
	registerUser,
	verifyEmail,
	loginUser,
	googlelogin,
} from "../controllers/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", loginUser);
router.post("/google-login", googlelogin);

export default router;
