import Team from "../models/team.model.js";
import User from "../models/user.model.js";
import { transporter } from "../utils/email.js";
import mongoose from "mongoose";

export const createNewTeam = async (teamName, logo, elo, region, creatorId) => {
	let team;

	team = await Team.findOne({ teamName });

	if (team) {
		throw {
			status: 409,
			message: "Team with this name Already Exists ",
		};
	}

	team = await Team.create({
		teamName,
		logo,
		elo,
		region,
		creatorId,
	});

	if (!team) {
		throw {
			status: 400,
			message: "Error while creating team",
		};
	}
	return {
		status: 201,
		message: "Team created successfully..",
	};
};

export const addNewTeamMember = async (email, teamId) => {
	const teamMember = await User.findOne({ email: email });

	if (!teamMember) {
		throw {
			status: 409,
			message: "User Not Found Please send registration link...",
		};
	} else {
		let team = await Team.findOne({ _id: teamId });

		if (!team) {
			throw {
				status: 409,
				message: "Team name Not Found",
			};
		}

		if (!team.teamMembers.includes(teamMember._id)) {
			const newTeamMembers = [...team.teamMembers, teamMember._id];
			const addTeamMember = await Team.findByIdAndUpdate(
				teamId,
				{ teamMembers: newTeamMembers },
				{
					new: true,
				}
			);
			await sendEmailToTeamMember(teamMember.email);
			// Return a success response
			return {
				status: 200,
				message: "Member added successfully...",
			};
		} else {
			return res.json({ message: "Already exists" });
		}
	}
};

export const promoteTeamMember = async (userId, role) => {
	const teamMember = await User.findOne({ _id: userId });

	if (teamMember) {
		const promoteMember = await User.findOneAndUpdate(
			new mongoose.Types.ObjectId(userId),
			{
				role: role,
			}
		);
		return {
			status: 200,
			message: "Member Promoted to  Captain...",
		};
	} else {
		throw {
			status: 409,
			message: "Team name Not Found",
		};
	}
};

export const removeTeamMember = async (userId, teamId, loggedInUserId) => {
	const loggedInUser = await User.findOne({ _id: loggedInUserId });
	const isTeamMember = await User.findOne({ _id: userId });
	if (isTeamMember && isTeamMember.role !== "CAPTAIN") {
		const findTeam = await Team.findOne({ _id: teamId });
		if (findTeam && loggedInUser.role === "CAPTAIN") {
			findTeam.teamMembers = findTeam.teamMembers.filter(
				(member) => member != userId
			);
			console.log(findTeam.teamMembers);
			await findTeam.save();

			return {
				status: 200,
				message: "Member Removed...",
			};
		} else {
			throw {
				status: 409,
				message: "Team name Not Found or only captain can perform this action",
			};
		}
	} else {
		throw {
			status: 409,
			message: "Team member Not Found",
		};
	}
};

// Send Email to Team Member
const sendEmailToTeamMember = async (to) => {
	try {
		await transporter.sendMail({
			from: "admin@gmail.com",
			to: to,
			subject: "Welcome to The National TableTop League",
			html: `<p>Hi! I am adding you as Team Member in my Team `,
		});
		console.log("Email sent");
	} catch (error) {
		console.log("Email not sent", error);
	}
};
