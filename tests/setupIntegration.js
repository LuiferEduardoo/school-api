const { sequelize } = require('../libs/sequelize');
const app = require('../server');
const nodemailer = require("nodemailer");
const fs = require('fs');
const { rimraf } = require('rimraf');
const path = require('path');

jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockImplementation((mailoptions, callback) => {})
    })
}));

let tempDir = path.resolve('./uploads_test');

const User = sequelize.models.User;
const Rol = sequelize.models.Rol;
const RolUser = sequelize.models.RolUser;

let server;

beforeAll(async () => {
    await sequelize.sync({ force: true });
    server = app.listen(3001, () => {});

    const roles = [
        'administrador',
        'coordinador',
        'rector',
        'estudiante',
        'docente',
        'orientador'
    ];

    const roleInstances = {};
    for (const roleName of roles) {
        roleInstances[roleName] = await Rol.create({ rol: roleName });
    }

    const users = [
        { role: 'administrador', name: 'nameAdministrador', lastName: 'lastNameAdministrador', email: 'administrador@test.com', username: 'usernameAdministrador', password: 'passwordAdministrador' },
        { role: 'coordinador', name: 'nameCoordinator', lastName: 'lastNameCoordinator', email: 'coordinator@test.com', username: 'usernameCoordinator', password: 'passwordCoordinator' },
        { role: 'rector', name: 'nameRector', lastName: 'lastNameRector', email: 'rector@test.com', username: 'usernameRector', password: 'passwordRector' },
        { role: 'docente', name: 'nameTeacher', lastName: 'lastNameTeacher', email: 'teacher@test.com', username: 'usernameTeacher', password: 'passwordTeacher' },
        { role: 'orientador', name: 'nameCounselor', lastName: 'lastNameCounselor', email: 'counselor@test.com', username: 'usernameCounselor', password: 'passwordCounselor' },
        { role: 'estudiante', name: 'nameStudent1', lastName: 'lastNameStudent1', email: 'student1@test.com', username: 'usernameStudent1', password: 'passwordStudent1' },
        { role: 'estudiante', name: 'nameStudent2', lastName: 'lastNameStudent2', email: 'student2@test.com', username: 'usernameStudent2', password: 'passwordStudent2' },
        { role: 'estudiante', name: 'nameStudent3', lastName: 'lastNameStudent3', email: 'student3@test.com', username: 'usernameStudent3', password: 'passwordStudent3' },
        { role: 'estudiante', name: 'nameUserInactive', lastName: 'lastNameUserInactive', email: 'userinactive@test.com', username: 'usernameUserInactive', password: 'passworUserInactive', active: false }
    ];

    for (const userData of users) {
        const { role, ...userInfo } = userData;
        const userInstance = await User.create(userInfo);
        await RolUser.create({ userId: userInstance.id, rolId: roleInstances[role].id });
    }
});

afterAll(async () => {
    server.close();
    if (fs.existsSync(tempDir)) {
        await rimraf(tempDir);
    }
    await sequelize.close();
});

global.request = require('supertest')(app);