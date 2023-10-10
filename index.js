import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import ConnectDB from "./config/db.js";
import userRoutes from "./routes/user.route.js";

const app = express();
dotenv.config();
ConnectDB();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

export default app;
