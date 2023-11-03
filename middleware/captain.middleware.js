import UserTeam from "../models/userteam.model.js"

export const isCaptain = (userId,teamId) => {
    
    const teamId = req.params.teamId;
    const userId = req.userId
    const findCaptain = UserTeam.findOne({ userId, teamId, role: 'captain' })
    return findCaptain;

};