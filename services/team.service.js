import Team from "../models/team.model.js";
import User from "../models/user.model.js";
import { transporter } from "../utils/email.js";
import crypto from "crypto";
import mongoose from "mongoose";
import UserTeam from "../models/userteam.model.js";

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
export const inviteTeamMember = async (email, teamId, teamCreatorId) => {
	const findUser = await User.findOne({ email: email });
	const findTeam = await Team.findOne({ _id: teamId });
	if (!findUser) {
		throw {
			status: 401,
			message: "Send Registration link",
		};
	}
	if (!findTeam || findTeam.creatorId != teamCreatorId) {
		throw {
			status: 401,
			message: "Team not found",
		};
	}
	const verificationToken = generateVerificationToken();
	await transporter.sendMail({
		from: "admin@gmail.com",
		to: email,
		subject: "Welcome To Our Organization",
		html: `<p>Sending Invitation to join NTL. Token : ${verificationToken}</p>`,
	});
	const userId = findUser._id;
	const filter = { _id: userId };
	const update = { verificationToken: verificationToken };
	await User.updateOne(filter, update);
	return {
		status: 201,
		message: "Invitation sent.",
	};
};

export const acceptInvitation = async (token, teamId) => {
	const user = await User.findOne({ _id: "652983460eda9b1f8a771f2f" });
	console.log(user);
	if (!user) {
		throw {
			status: 404,
			message: "Invalid link",
		};
	} else {
		const userId = user._id;
		const filter = { _id: userId };
		const update = { verificationToken: null };
		await User.updateOne(filter, update);
		const newmember = await UserTeam.create({
			userId: user._id,
			teamId: teamId,
			role: "player",
		});
		newmember.save();
		await Team.updateOne(teamId, { inviteTeamMember: user.email });
		return {
			status: 201,
			message: "Request accepted",
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
// Function for creating verification token
const generateVerificationToken = () => {
	const buffer = crypto.randomBytes(20);
	return buffer.toString("hex");
};
