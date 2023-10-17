import Event from "../models/event.model.js";

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
