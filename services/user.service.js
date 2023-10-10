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
       <p>verification Code</p><br/><br/><p>${verificationToken}</p>
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
