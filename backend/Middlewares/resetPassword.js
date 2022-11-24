import nodeMailer from "nodemailer";

const sendEmail = async (options) => {
    var transporter = nodeMailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: options.email,
        subject: options.subject,
        text: options.emailToSend
    };
    await transporter.sendMail(mailOptions);
};

export default sendEmail;