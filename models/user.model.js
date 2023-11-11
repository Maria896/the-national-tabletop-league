import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // unique: true,
  },
  region: {
    type: String,
    required: true,
    // unique: true,
  },
  state: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  verificationToken: {
    type: String,
  },
  isVerified: {
    type: Boolean,
  },
  resetToken: {
    type: String,
  },
  tokenExpiration: {
    type: Date,
  },
  globalRole: {
    type: String,
    enum: ["super admin", "player", "admin"],
  },
});

export default mongoose.model("User", userSchema);
