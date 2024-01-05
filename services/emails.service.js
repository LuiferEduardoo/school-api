const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path');

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
async function SendMain(email, subject, type, date) {
    let template;
    switch (type) {
        case 'admissionRequest':
            template = path.join(__dirname, '../views/admissionRequest.ejs');
            break;
        case 'admissionDecision':
            template = path.join(__dirname, '../views/admissionDecision.ejs');
            break;
        default:
            break;
    }
    const html = await ejs.renderFile(template, date);
    const info = await transporter.sendMail({
          from: config.emailHost, // sender address
          to: email, // list of receivers
          subject: subject, // Subject line
          html: html, // html body
    });
}

module.exports = { SendMain };