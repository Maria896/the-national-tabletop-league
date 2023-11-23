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
  await UserTeam.create({
    userId: team.creatorId,
    teamId: team._id,
    role: "captain",
  });
  return {
    status: 201,
    message: "Team created successfully..",
  };
};

export const promoteTeamMember = async (userId, teamId, role) => {
  const teamMember = await UserTeam.findOne({ userId: userId, teamId: teamId });

  if (teamMember) {
    teamMember.role = role;
    teamMember.save();
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
  const isAuthorizedUser = await UserTeam.findOne({
    userId: loggedInUserId,
    teamId: teamId,
  });
  const isTeamMember = await UserTeam.findOne({
    userId: userId,
    teamId: teamId,
  });
  if (isAuthorizedUser && isAuthorizedUser.role == "captain") {
    if (isTeamMember.role != "captain") {
      const removeMember = await UserTeam.deleteOne({ _id: isTeamMember._id });
      return {
        status: 200,
        success: true,
        message: "Member Removed...",
      };
    } else {
      throw {
        status: 409,
        message: "Captains cannot remove captains",
      };
    }
  } else {
    throw {
      status: 409,
      success: false,
      message: "Only captains can remove players",
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
  const findTeamMember = await UserTeam.findOne({
    userId: findUser._id,
    teamId: teamId,
  });
  if (findTeamMember) {
    throw {
      status: 404,
      success: false,
      message: "Already Member of your team",
    };
  }
  const verificationToken = generateVerificationToken();
  await transporter.sendMail({
    from: "admin@gmail.com",
    to: email,
    subject: "Welcome To Our Organization",
    html: `<p>Sending Invitation to join NTL. Token :
    <a href="api/team/invite-new-member/${findTeam._id}">${verificationToken}</a></p>
    `,
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
  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    throw {
      status: 404,
      success: false,
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
    await newmember.save();
    return {
      status: 201,
      success: true,
      message: "Request accepted",
    };
  }
};

export const leaveTeam = async (teamId, loggedInUserId) => {
  const isAuthorizedUser = await UserTeam.findOne({
    userId: loggedInUserId,
    teamId: teamId,
  });
  if (isAuthorizedUser) {
    const removeMember = await UserTeam.deleteOne({
      _id: isAuthorizedUser._id,
    });
    return {
      status: 200,
      success: true,
      message: "Team leaved...",
    };
  } else {
    throw {
      status: 409,
      success: false,
      message: "Player not found...",
    };
  }
};
export const getTeams = async (userId) => {
  const checkUser = await User.findOne({ _id: userId });
  console.log(checkUser);
  if (checkUser.globalRole === "super admin") {
    const teams = await Team.find();
    let teamDetailAndPlayerList = [];
    for (const team of teams) {
      const teamDetail = {
        team: team,
        teamPlayers: await getTeamPlayers(team._id),
      };
      teamDetailAndPlayerList.push(teamDetail);
    }
    return {
      status: 200,
      message: "All Teams..",
      teamDetailAndPlayerList,
    };
  } else if (checkUser.globalRole === "player") {
    const userTeams = await UserTeam.find({ userId: userId });
    const getTeamIds = (teams) => {
      return teams.map((team) => team.teamId);
    };

    const teamIds = getTeamIds(userTeams);
    const teams = await Team.find({ _id: { $in: teamIds } });
    let teamDetailAndPlayerList = [];
    for (const team of teams) {
      const teamDetail = {
        team: team,
        teamPlayers: await getTeamPlayers(team._id),
      };
      teamDetailAndPlayerList.push(teamDetail);
    }

    return {
      status: 200,
      message: "All Teams..",
      teamDetailAndPlayerList,
    };
  }
};
export const findTeamById = async (teamId) => {
  const team = await Team.findOne({ _id: teamId });
  const teamPlayers = getTeamPlayers(teamId);
  if (team) {
    return {
      status: 200,
      message: "Team found..",
      team,
      teamPlayers,
    };
  } else {
    throw {
      status: 404,
      success: false,
      message: "Team not found",
    };
  }
};
export const getTeamPlayers = async (teamId) => {
  const team = await Team.findOne({ _id: teamId });
  if (team) {
    const userTeams = await UserTeam.find({ teamId: teamId });
    const userIds = userTeams.map((teamPlayer) => teamPlayer.userId);

    const teamPlayers = await User.find({ _id: { $in: userIds } });
    return teamPlayers;
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
