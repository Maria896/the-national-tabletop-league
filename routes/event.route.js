import express from "express";
import { addNewTeam, createEvent } from "../controllers/event.controller.js";
import { authHandler } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-event", authHandler, createEvent);
router.put("/add-team/:eventId", authHandler, addNewTeam);
router.put("/remove-team/:eventId", authHandler, addNewTeam);

export default router;
