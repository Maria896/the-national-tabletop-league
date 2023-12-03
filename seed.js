import dotenv from "dotenv";
import User from "./models/user.model.js";
import Team from "./models/team.model.js";
import UserTeam from "./models/userteam.model.js";
import ConnectDB from "./config/db.js";
import usersData from "./data/user.data.js";
import teamData from "./data/team.data.js";

dotenv.config();
ConnectDB();

const importData = async () => {
  try {
    await User.deleteMany({});
    await Team.deleteMany({});

    const users = await User.insertMany(usersData);
    const [adminUser] = users;

    const getPlayers = await User.find({ role: "player" });

    const newTeams = teamData.map((t) => {
      return {
        ...t,
        creatorId: adminUser._id,
      };
    });
    await Team.insertMany(newTeams);
    console.log("Data imported successfully.");
    process.exit();
  } catch (error) {
    console.log(`Unable to import data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    // await User.deleteMany({});
    await Team.deleteMany({});
    await UserTeam.deleteMany({});
    console.log("Data destroyed successfully.");
    process.exit();
  } catch (error) {
    console.log(`Unable to destroy data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
