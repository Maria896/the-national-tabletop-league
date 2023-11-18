import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'arjun68@ethereal.email',
        pass: 'GEzypwcpx3t7WcGKah'
    }
});