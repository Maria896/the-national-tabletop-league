import mongoose from "mongoose";

const userTeamSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	teamId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Team",
	},
	role: {
		type: String,
		enum: ["player", "captain"],
		default: "player",
	},
});

export default mongoose.model("UserTeam", userTeamSchema);
