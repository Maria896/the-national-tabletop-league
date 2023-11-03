import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  rosterSubmissionDate: {
    type: Date,
    required: true,
  },
  rosterRevealDate: {
    type: Date,
    required: true,
  },
  participatingTeams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
  ],
  roster: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
	  armyList:{
		type: String,
	  }
    },
  ],
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Event", eventSchema);
