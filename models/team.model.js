import mongoose from "mongoose";
const REGION = {
	hghgfhf,
	hgfhgfhgf,
	ghnggg,
};

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
		type: REGION,
		required: true,
	},
});

export default mongoose.model("Team", teamSchema);
