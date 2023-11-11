import UserTeam from "../models/userteam.model.js";

export const isCaptain = (userId, teamId) => {
  const findCaptain = UserTeam.findOne({ userId, teamId, role: "captain" });
  return findCaptain;
};
