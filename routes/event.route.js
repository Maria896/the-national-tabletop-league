import express from "express";
import { createEvent } from "../controllers/event.controller.js";
import { authHandler } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-event", authHandler, createEvent);

export default router;
