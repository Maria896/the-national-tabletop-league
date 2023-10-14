import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
	teamName: {
		type: String,
		required: true,
		unique: true,
	},
	logo: {
		type: String,
		required: true,
	},
	elo: {
		type: Number,
		required: true,
	},
	region: {
		type: String,
		enum: ["REGIONA", "REGIONA", "REGIONA", "REGIONA"],
		default: "REGIONA",
	},
	creatorId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	invitedMembers: [
		{
			type: String,
		},
	],
});

export default mongoose.model("Team", teamSchema);
