// __tests__/mailer.test.js

const nodemailer = require("nodemailer");
const ejs = require('ejs');
const path = require('path');
const { SendMain } = require('../../../services/emails.service');  // Ajusta la ruta según tu estructura de archivos
const { config } = require('../../../config/config');

jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockReturnValue((mailoptions, callback) => {})
    })
}));
jest.mock('ejs');


describe('SendMail', () => {
    const email = 'test@example.com';
    const subject = 'Test Subject';
    const date = { key: 'value' };
    

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should render the correct template and send email for admissionRequest', async () => {
        const templatePath = path.join(__dirname, '../../../views/admissionRequest.ejs');
        ejs.renderFile.mockResolvedValue('<html>Admission Request</html>');

        await SendMain(email, subject, 'admissionRequest', date);

        expect(ejs.renderFile).toHaveBeenCalledWith(templatePath, {...date, emailAdmission: config.emailAdmission}, email);
    });

    test('should render the correct template and send email for admissionDecision', async () => {
        const templatePath = path.join(__dirname, '../../../views/admissionDecision.ejs');
        ejs.renderFile.mockResolvedValue('<html>Admission Decision</html>');

        await SendMain(email, subject, 'admissionDecision', date);

        expect(ejs.renderFile).toHaveBeenCalledWith(templatePath, {...date, emailAdmission: config.emailAdmission}, email);
    });

    test('should render the correct template and send email for recoveryPassword', async () => {
        const templatePath = path.join(__dirname, '../../../views/recoveryPassword.ejs');
        ejs.renderFile.mockResolvedValue('<html>Recovery Password</html>');

        await SendMain(email, subject, 'recoveryPassword', date);

        expect(ejs.renderFile).toHaveBeenCalledWith(templatePath, date, email);
    });

    test('should render the correct template and send email for changePassword', async () => {
        const templatePath = path.join(__dirname, '../../../views/changePassword.ejs');
        ejs.renderFile.mockResolvedValue('<html>Change Password</html>');

        await SendMain(email, subject, 'changePassword', date);

        expect(ejs.renderFile).toHaveBeenCalledWith(templatePath, {...date, emailChangePassword: config.emailChangePassword}, email);
    });

    test('should not send email for an unknown type', async () => {
        await expect(
            SendMain(email, subject, 'unknownType', date)
        ).rejects.toThrow('Type does not have a template');
    });
});
