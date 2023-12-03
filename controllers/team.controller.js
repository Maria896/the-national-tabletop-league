import {
  acceptInvitation,
  createNewTeam,
  findTeamById,
  getTeams,
  inviteTeamMember,
  leaveTeam,
  promoteTeamMember,
  removeTeamMember,
} from "../services/team.service.js";

// Path     :   /api/team/create-team
// Method   :   Post
// Access   :   Private
// Desc     :   Create New Team
export const createTeam = async (req, res) => {
  try {
    console.log(req.file);
    const { teamName, elo, region } = req.body;
    const creatorId = req.userId;
    let logo;
    if (req.file) {
      logo = req.file.filename;
    }

    const { status, message } = await createNewTeam(
      teamName,
      logo,
      elo,
      region,
      creatorId
    );
    res.send({
      status: status,
      message: message,
      captain,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Path     :   /api/team/promote-member
// Method   :   Put
// Access   :   Private
// Desc     :   Promote team member to Captain
export const promoteMember = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.userId;
    const teamId = req.params.teamId;

    const { status, message } = await promoteTeamMember(userId, teamId, role);
    res.send({
      status: status,
      message: message,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
// Path     :   /api/team/remove-member
// Method   :   Put
// Access   :   Private
// Desc     :   Remove team member
export const removeMember = async (req, res) => {
  try {
    const loggedInUserId = req.userId;
    const teamId = req.params.teamId;
    const userId = req.params.userId;
    const { status, message } = await removeTeamMember(
      userId,
      teamId,
      loggedInUserId
    );
    res.send({
      status: status,
      message: message,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
// Path     :   /api/team/invite-new-member/:teamId
// Method   :   Put
// Access   :   Private
// Desc     :   Invite new team member
export const inviteNewTeamMember = async (req, res) => {
  try {
    const { email } = req.body;
    const teamId = req.params.teamId;
    const teamCreatorId = req.userId;
    const { status, message } = await inviteTeamMember(
      email,
      teamId,
      teamCreatorId
    );
    console.log(status);
    res.send({
      status: status,
      message: message,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
// Path     :   /api/team/accept-invitation/:token/:teamId
// Method   :   Put
// Access   :   Private
// Desc     :   Accept invitation to join NTL
export const acceptInvitationFromOwner = async (req, res) => {
  try {
    const { token, teamId } = req.params;
    console.log(token);
    const { status, message } = await acceptInvitation(token, teamId);
    res.send({
      status: status,
      message: message,
    });
    const redirectURL = "/dashboard";
    res.redirect(redirectURL);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Path     :   /api/team/leave-team/:teamId
// Method   :   Delete
// Access   :   Private
// Desc     :  Leave team
export const leaveNtlTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const loggedInUserId = req.userId;
    const { status, message } = await leaveTeam(teamId, loggedInUserId);
    res.send({
      status: status,
      message: message,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Path     :   /api/team/
// Method   :   Get
// Access   :   Private
// Desc     :   Get All teams
export const getAllTeams = async (req, res) => {
  const userId = req.userId;
  console.log(userId);
  try {
    const { status, message, teams } = await getTeams(userId);
    res.send({
      status: status,
      message: message,
      teams,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Path     :   /api/team/:id
// Method   :   Get
// Access   :   Private
// Desc     :   Get team by id
export const getTeamById = async (req, res) => {
  const { teamId } = req.params;
  try {
    const { status, message, teamData } = await findTeamById(teamId);
    res.send({
      status: status,
      message: message,
      teamData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
