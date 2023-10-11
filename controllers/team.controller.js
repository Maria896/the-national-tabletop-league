import {
	addNewTeamMember,
	createNewTeam,
	promoteTeamMember,
	removeTeamMember,
} from "../services/team.service.js";

// Path     :   /api/team/create-team
// Method   :   Post
// Access   :   Private
// Desc     :   Create New Team
export const createTeam = async (req, res) => {
	try {
		const { teamName, logo, elo, region } = req.body;
		const creatorId = req.userId;
		console.log(creatorId);

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
		});
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
};
// Path     :   /api/team/add-team-member/:teamId
// Method   :   Put
// Access   :   Private
// Desc     :   Add new team member in your team
export const addTeamMember = async (req, res) => {
	try {
		const { email } = req.body;
		const { teamId } = req.params;
		const { status, message } = await addNewTeamMember(email, teamId);
		res.send({
			status: status,
			message: message,
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
		const { status, message } = await promoteTeamMember(userId, role);
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
		console.log(
			`Logged In User Id : ${loggedInUserId}, teamId : ${teamId}, userId:${userId}`
		);
		const { status, message } = await removeTeamMember(
			userId,
			teamId,
			loggedInUserId
		);
		console.log("after");
		res.send({
			status: status,
			message: message,
		});
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
};