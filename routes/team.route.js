import express from "express";
import {
  acceptInvitationFromOwner,
  createTeam,
  inviteNewTeamMember,
  leaveNtlTeam,
  promoteMember,
  removeMember,
} from "../controllers/team.controller.js";
import { authHandler } from "../middleware/auth.middleware.js";
import { upload } from "../utils/image.js";

const router = express.Router();

router.post("/create-team", authHandler, upload.single("logo"), createTeam);
router.put("/invite-new-member/:teamId", authHandler, inviteNewTeamMember);
router.put("/accept-invitation/:token/:teamId", acceptInvitationFromOwner);
router.put("/promote-member/:userId/:teamId", authHandler, promoteMember);
router.put("/remove-member/:userId/:teamId", authHandler, removeMember);
router.delete("/leave-team/:teamId", authHandler, leaveNtlTeam);

export default router;
