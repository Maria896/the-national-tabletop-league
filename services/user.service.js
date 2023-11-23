import bcrypt from "bcrypt";
import crypto from "crypto";
import Jwt from "jsonwebtoken";
import { transporter } from "../utils/email.js";
import User from "../models/user.model.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.Client_ID);

export const register = async (
  firstName,
  lastName,
  email,
  region,
  state,
  password
) => {
  let user;

  user = await User.findOne({ email });
  if (user && user.isVerified == true) {
    throw {
      status: 409,
      message: "User with this email is already exists",
    };
  } else if (user && user.isVerified == false) {
    await userModel.findOneAndDelete({ email });
  }
  const hashPassword = hashedPassword(password);
  const verificationToken = generateVerificationToken();

  user = await User.create({
    firstName,
    lastName,
    email,
    region,
    state,
    password: hashPassword,
    verificationToken,
    tokenExpiration: Date.now() + 3600000,
  });

  if (!user) {
    throw {
      status: 400,
      message: "Error while creating account",
    };
  }

  transporter.sendMail(
    {
      to: user.email,
      from: "admin@gmail.com",
      subject: "Verify Account",
      html: `<h2>Verify Account</h2>
       <p><a href="http://localhost:${process.env.PORT}/api/user/verify-email/${verificationToken}">Click Here to verify your account</a></p>
      `,
    },
    (error, email) => {
      if (error) {
        throw {
          status: 400,
          message: "error while sending email",
        };
      }
    }
  );
  return {
    status: 201,
    message: "Account varification email has been sent to you",
    token: verificationToken,
  };
};
export const verifyUserEmail = async (token) => {
  const user = await User.findOne({
    verificationToken: token,
  });
  //console.log(user);
  if (!user && user.token_expiration < Date.now()) {
    throw {
      status: 404,
      message: "Invalid link",
    };
  } else {
    const verifiedUser = await User.findByIdAndUpdate(
      user._id,
      { isVerified: true },
      {
        new: true,
      }
    );
    return {
      status: 200,
      message: "Your email has been verified successfully",
    };
  }
};

export const login = async (email, password) => {
  const user = await User.findOne({
    email: email,
  });

  if (!user) {
    throw {
      status: 400,
      message: "User not found",
    };
  }
  const comparePassword = bcrypt.compareSync(password, user.password);

  if (!comparePassword) {
    throw {
      status: 401,
      message: "Invalid password please enter valid password",
    };
  }
  const sceretKey = process.env.JWT_SECRET;
  const token = Jwt.sign({ id: user.id }, sceretKey, { expiresIn: "7d" });
  return {
    status: 200,
    message: "Login successful.",
    token: token,
    user: user,
  };
};
export const getUsers = async (userId) => {
  const findSuperAdmin = await User.findById(userId);
  if (findSuperAdmin.globalRole === "super admin") {
    const users = await User.find();
    return {
      status: 200,
      message: "All Users..",
      users,
    };
  } else {
    throw {
      status: 401,
      message: "You are not a super admin",
    };
  }
};
export const updateProfile = async (
  userId,
  firstName,
  lastName,
  email,
  region,
  state,
  profileImage
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw {
      status: 404,
      message: "User not found",
    };
  }
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.region = region;
  user.state = state;
  user.profileImage = profileImage;

  await user.save();
  return {
    status: 200,
    message: "Profile updated successfully",
  };
};
export const googlelogin = async (tokenId) => {
  console.log("google login");
  const response = client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.Client_ID,
  });

  if (!response) {
    throw {
      status: 400,
      message: "something went wrong",
    };
  }

  const { name, email } = response.payload;

  let user;
  user = await User.findOne({
    email,
  });

  if (user) {
    return {
      success: true,
      data: {
        name: user.name,
        email: user.email,
        token: generateVerificationToken(),
      },
    };
  }

  let password = name + email;
  const hashPassword = hashedPassword(password);

  user = await User.create({
    name,
    email,
    password: hashPassword,
  });

  if (!user) {
    throw {
      status: 400,
      message: "error while login with google",
    };
  }

  return {
    success: true,
    data: {
      name: user.name,
      email: user.email,
      token: generateVerificationToken(),
    },
  };
};
export const forgotPasword = async (email) => {
  const user = await User.findOne({ email });
  console;
  if (!user) {
    throw {
      status: 401,
      message: "Invalid Email",
    };
  }
  const token = generateVerificationToken();

  user.resetToken = token;

  user.tokenExpiration = Date.now() + 3600000;

  await user.save();
  //send email
  transporter.sendMail(
    {
      to: user.email,
      from: "maria@gmail.com",
      subject: "password Reset",
      html: `<h2>Reset Password</h2>
        <a href="api/auth/reset-password/${token}">Click Here to password Reset </a>
        `,
    },
    (error, email) => {
      if (error) {
        console.log({ error });
        throw {
          status: 400,
          message: "error while sending email",
        };
      }
    }
  );
  return {
    successs: true,
    message: "reset Password Email has been Sent",
  };
};

export const resetUserPasword = async (password, confirmPassword, token) => {
  const user = await User.findOne({
    resetToken: token,
  });

  if (!user) {
    throw {
      status: 400,
      message: "link expired...",
    };
  }

  if (password !== confirmPassword) {
    throw {
      status: 400,
      message: "password and confirm password doesn't match",
    };
  }

  const hashPassword = hashedPassword(password);
  user.password = hashPassword;
  user.resetToken = undefined;
  user.tokenExpiration = undefined;

  await user.save();
  return {
    status: 200,
    message: "password updated...",
  };
};
// Function for hashed password
const hashedPassword = (password) => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  return hashedPassword;
};

// Function for creating verification token
const generateVerificationToken = () => {
  const buffer = crypto.randomBytes(20);
  return buffer.toString("hex");
};
