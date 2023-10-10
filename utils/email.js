import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
	host: "smtp.ethereal.email",
	port: 587,
	auth: {
		user: "chelsea.padberg@ethereal.email",
		pass: "KZ9SR1t22HffRqDQQF",
	},
});
