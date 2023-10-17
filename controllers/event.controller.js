import { createNewEvent } from "../services/event.service.js";

// Path     :   /api/event/create-event
// Method   :   Post
// Access   :   Private
// Desc     :   Create New Event
export const createEvent = async (req, res) => {
	try {
		const { name, date, location, rosterSubmissionDate, rosterRevealDate } =
			req.body;
		const creatorId = req.userId;
		console.log(creatorId);

		const { status, message } = await createNewEvent(
			name,
			date,
			location,
			rosterSubmissionDate,
			rosterRevealDate,
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
