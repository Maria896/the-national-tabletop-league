import mongoose from "mongoose";

const ConnectDB = async () => {
	try {
		let con = await mongoose.connect(process.env.MONGO_URI);
		console.log(`Database is connected with host ${con.connection.host}.`);
	} catch (error) {
		console.log(`Unable to connect with databse : ${error.message}`);
	}
};

export default ConnectDB;
