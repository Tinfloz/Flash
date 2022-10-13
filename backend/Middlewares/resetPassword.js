import nodeMailer from "nodemailer";

const sendEmail = async (options) => {
    var transporter = nodeMailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "e4accef9049191",
            pass: "6bfcdf55819962"
        }
    });
    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    await transporter.sendMail(mailOptions);
};

export default sendEmail;