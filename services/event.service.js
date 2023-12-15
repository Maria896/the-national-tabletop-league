import Event from "../models/event.model.js";
import Team from "../models/team.model.js";
import moment from "moment";
import mongoose from "mongoose";
import { isCaptain } from "../middleware/captain.middleware.js";

// const ObjectId = new mongoose.Types.ObjectId();
const { ObjectId } = mongoose.Types;
export const createNewEvent = async (
  name,
  date,
  location,
  rosterSubmissionDate,
  rosterRevealDate,
  creatorId
) => {
  let event;
  const formattedDate = moment(date, "DD/MM/YYYY", true);
  const formattedRosterSubmissionDate = moment(
    rosterSubmissionDate,
    "DD/MM/YYYY",
    true
  );
  const formattedRosterRevealDate = moment(
    rosterRevealDate,
    "DD/MM/YYYY",
    true
  );
  event = await Event.create({
    name,
    date: formattedDate,
    location,
    rosterSubmissionDate: formattedRosterSubmissionDate,
    rosterRevealDate: formattedRosterRevealDate,
    creatorId,
  });

  if (!event) {
    throw {
      status: 400,
      success: false,
      message: "Error while creating event",
    };
  }

  return {
    status: 201,
    success: true,
    message: "Event created successfully..",
  };
};

export const addTeam = async (userId, teams, eventId) => {
  const foundEvent = await Event.findOne({ _id: eventId });
  if (!foundEvent) {
    throw {
      status: 409,
      success: false,
      message: "Event not found...",
    };
  }

  const foundTeams = await Team.find({ teamName: { $in: teams } });
  const foundTeamIds = foundTeams.map((team) => team._id);

  const foundTeamNames = foundTeams.map((team) => team.teamName);

  const missingTeams = teams.filter((name) => !foundTeamNames.includes(name));
  console.log(missingTeams);
  if (missingTeams.length > 0) {
    throw {
      status: 409,
      success: false,
      message: `Teams not found: ${missingTeams.join(", ")}`,
    };
  }
  const existingTeams = foundEvent.participatingTeams.filter((teamId) =>
    foundTeamIds.some((foundId) => foundId.equals(teamId))
  );

  if (existingTeams.length < 0) {
    throw {
      status: 409,
      success: false,
      message: `Teams already exist: ${existingTeams.join(", ")}`,
    };
  } else {
    // const addTeamInEvent = await Event.findByIdAndUpdate(
    //   eventId,
    //   { $push: { participatingTeams: foundTeamIds } },
    //   {
    //     new: true,
    //   }
    // );
    const objectIds = foundTeamIds.map((id) => new ObjectId(id));
    const filter = {
      _id: { $in: objectIds },
    };
    const update = { event: foundEvent._id };

    const result = await Team.updateMany(filter, update, {
      new: true,
    });
    console.log(result);
    if (!result) {
      throw {
        status: 409,
        success: false,
        message: "Error while adding team member...",
      };
    }
    return {
      status: 200,
      success: true,
      message: "Team added successfully..",
    };
  }
};

export const removeTeam = async (userId, teamName, eventId) => {
  const findEvent = await Event.findOne({
    $and: [{ _id: eventId }, { _id: userId }],
  });
  if (!findEvent) {
    throw {
      status: 409,
      success: false,
      message: "Event not found...",
    };
  }

  const findTeam = await Team.findOne({ teamName: teamName });
  if (!findTeam) {
    throw {
      status: 409,
      success: false,
      message: "Team not found...",
    };
  }
  const filterTeams = findEvent.participatingTeams.filter(
    (team) => team.Id != findEvent.participatingTeams._id
  );
  if (filterTeams) {
    const removeTeamFromEvent = await findEvent.findByIdAndUpdate(
      eventId,
      { participatingTeams: filterTeams },
      {
        new: true,
      }
    );
    if (!removeTeamFromEvent) {
      throw {
        status: 409,
        success: false,
        message: "Error while removing team member...",
      };
    }
    return {
      status: 200,
      success: true,
      message: "Team removed successfully..",
    };
  }
};

export const createRoaster = async (userId, eventId, teamId, teamMembers) => {
  const findEvent = Event.findOne({
    _id: eventId,
    creatorId: userId,
    participatingTeams: teamId,
  });
  if (!findEvent) {
    throw {
      status: 409,
      success: false,
      message: "Event not found...",
    };
  }
  const captain = isCaptain(userId, teamId);
  if (captain) {
    const checkTeamMember = userteamModel.findOne({ userId, teamId });
    if (checkTeamMember) {
      const filter = { _id: eventId, creatorId: userId };
      const newUser = {
        userId: userId,
      };
      const update = {
        $push: {
          roster: newUser,
        },
      };
      Event.updateOne(filter, update, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          console.log(result);
        }
      });
    }
  }
};
