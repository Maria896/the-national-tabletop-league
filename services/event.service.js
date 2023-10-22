import Event from "../models/event.model.js";
import Team from "../models/team.model.js";

export const createNewEvent = async (
	name,
	date,
	location,
	rosterSubmissionDate,
	rosterRevealDate,
	creatorId
) => {
	let event;

	event = await Event.create({
		name,
		date,
		location,
		rosterSubmissionDate,
		rosterRevealDate,
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

export const addTeam = async (userId, teamName, eventId) => {
	const findEvent = await Event.findOne({ _id: eventId });
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

	if (!findEvent.participatingTeams.includes(findTeam._id)) {
		const newTeams = [...findEvent.participatingTeams];
		const addTeamInEvent = await findEvent.findByIdAndUpdate(
			eventId,
			{ participatingTeams: newTeams },
			{
				new: true,
			}
		);
		if (!addTeamInEvent) {
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
	} else {
		throw {
			status: 409,
			success: false,
			message: "Already exists...",
		};
	}
};

export const removeTeam = async (userId, teamName, eventId) => {
	const findEvent = await Event.findOne({ _id: eventId });
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

	if (!findEvent.participatingTeams.includes(findTeam._id)) {
		const newTeams = [...findEvent.participatingTeams];
		const addTeamInEvent = await findEvent.findByIdAndUpdate(
			eventId,
			{ participatingTeams: newTeams },
			{
				new: true,
			}
		);
		if (!addTeamInEvent) {
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
	} else {
		throw {
			status: 409,
			success: false,
			message: "Already exists...",
		};
	}
};
