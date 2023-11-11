import {
  addTeam,
  createNewEvent,
  removeTeam,
} from "../services/event.service.js";

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

// Path     :   /api/event/add-team/:eventId
// Method   :   Put
// Access   :   Private
// Desc     :   Add team in an event
export const addNewTeam = async (req, res) => {
  try {
    const { teamName } = req.body;
    const { eventId } = req.params;
    const userId = req.userId;

    const { status, message } = await addTeam(userId, teamName, eventId);
    res.send({
      status: status,
      message: message,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
// Path     :   /api/event/add-team/:eventId
// Method   :   Put
// Access   :   Private
// Desc     :   Add team in an event
export const removeTeamFromEvent = async (req, res) => {
  try {
    const { teamName } = req.body;
    const { eventId } = req.params;
    const userId = req.userId;

    const { status, message } = await removeTeam(userId, teamName, eventId);
    res.send({
      status: status,
      message: message,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
