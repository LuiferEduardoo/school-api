const nodemailer = require("nodemailer");

const { config } = require('./../config/config');

const transporter = nodemailer.createTransport({
    host: config.emailHost,
    secure: true,
    port: config.emailPort,
    auth: {
        user: config.emailUser,
        pass: config.emailPassword
    }
});
async function SendMain(email, subject, text, html) {
    const info = await transporter.sendMail({
          from: config.emailHost, // sender address
          to: email, // list of receivers
          subject: subject, // Subject line
          text: text, // plain text body
          html: html, // html body
    });
}

module.exports = { SendMain };