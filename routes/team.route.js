import express from "express";
import { addTeamMember, createTeam } from "../controllers/team.controller.js";
import { authHandler } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-team", authHandler, createTeam);
router.put("/add-team-member/:teamId",  addTeamMember);

export default router;
