import express from "express";
import {
	acceptInvitationFromOwner,
	addTeamMember,
	createTeam,
	inviteNewTeamMember,
	promoteMember,
	removeMember,
} from "../controllers/team.controller.js";
import { authHandler } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-team", authHandler, createTeam);
router.put("/add-team-member/:teamId", addTeamMember);
router.put("/invite-new-member/:teamId", authHandler, inviteNewTeamMember);
router.put(
	"/accept-invitation/:token/:teamId",

	acceptInvitationFromOwner
);
router.put("/promote-member/:userId", promoteMember);
router.put("/remove-member/:userId/:teamId", authHandler, removeMember);

export default router;
