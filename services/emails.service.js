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
async function SendMain(email, subject, type, data) {
    let template;
    switch (type) {
        case 'admissionRequest':
            template = path.join(__dirname, '../views/admissionRequest.ejs');
            data.emailAdmission = config.emailAdmission;
            break;
        case 'admissionDecision':
            template = path.join(__dirname, '../views/admissionDecision.ejs');
            data.emailAdmission = config.emailAdmission; 
            break;
        case 'recoveryPassword':
            template = path.join(__dirname, '../views/recoveryPassword.ejs');
            break
        case 'changePassword': 
            template = path.join(__dirname, '../views/changePassword.ejs');
            data.emailChangePassword = config.emailChangePassword;
            break
        default:
            throw new Error('Type does not have a template');
    }
    const html = await ejs.renderFile(template, data, email);
    const info = await transporter.sendMail({
          from: config.emailUser, // sender address
          to: email, // list of receivers
          subject: subject, // Subject line
          html: html, // html body
    });

    return info;
}

module.exports = { SendMain };