const { sequelize } = require('../libs/sequelize');
const app = require('../server')

const User = sequelize.models.User;
const Rol = sequelize.models.Rol;
const RolUser = sequelize.models.RolUser;

let server;

beforeAll(async () => {
    await sequelize.sync();
    server = app.listen(3001, () => {});
    const rolAdministrator = await Rol.create({rol: 'administrador'});
    const rolCoordinator = await Rol.create({rol: 'coordinador'});
    const rolRector = await Rol.create({rol: 'rector'});
    const rolStudent = await Rol.create({rol: 'estudiante'});
    const rolTeacher = await Rol.create({rol: 'docente'});
    const rolCounselor = await Rol.create({rol: 'orientador'});

    const userAdministrator = await User.create({
        name: 'nameAdministrador',
        lastName: 'lastNameAdministrador',
        username: 'usernameAdministrador',
        email: 'administrador@test.com',
        password: 'passwordAdministrador',
    });

    await RolUser.create({
        userId: userAdministrator.id,
        rolId: rolAdministrator.id
    });

    const userCoordinator = await User.create({
        name: 'nameCoordinator',
        lastName: 'lastNameCoordinator',
        username: 'usernameCoordinator',
        email: 'coordinator@test.com',
        password: 'passwordCoordinator',
    });
    await RolUser.create({
        userId: userCoordinator.id,
        rolId: rolCoordinator.id
    });
    const userRector = await User.create({
        name: 'nameRector',
        lastName: 'lastNameRector',
        username: 'usernameRector',
        email: 'rector@test.com',
        password: 'passwordRector',
    });
    await RolUser.create({
        userId: userRector.id,
        rolId: rolRector.id
    });
    
    const students = [
        {
            name: 'nameStudent1',
            lastName: 'lastNameStudent1',
            username: 'usernameStudent1',
            email: 'student1@test.com',
            password: 'passwordStudent1',
        },
        {
            name: 'nameStudent2',
            lastName: 'lastNameStudent2',
            username: 'usernameStudent2',
            email: 'student2@test.com',
            password: 'passwordStudent2',
        },
        {
            name: 'nameStudent3',
            lastName: 'lastNameStudent3',
            username: 'usernameStudent3',
            email: 'student3@test.com',
            password: 'passwordStudent3',
        }
    ];
    
    for (const studentData of students) {
        const student = await User.create(studentData);
        await RolUser.create({
            userId: student.id,
            rolId: rolStudent.id
        });
    }
    
    const userTeacher = await User.create({
        name: 'nameTeacher',
        lastName: 'lastNameTeacher',
        username: 'usernameTeacher',
        email: 'teacher@test.com',
        password: 'passwordTeacher',
    });
    await RolUser.create({
        userId: userTeacher.id,
        rolId: rolTeacher.id
    });
    
    const userCounselor = await User.create({
        name: 'nameCounselor',
        lastName: 'lastNameCounselor',
        username: 'usernameCounselor',
        email: 'counselor@test.com',
        password: 'passwordCounselor',
    });
    await RolUser.create({
        userId: userCounselor.id,
        rolId: rolCounselor.id
    });
    const userInactive = await User.create({
        name: 'nameUserInactive',
        lastName: 'lastNameUserInactive',
        username: 'usernameUserInactive',
        email: 'userinactive@test.com',
        password: 'passworUserInactive',
        active: false
    });
    await RolUser.create({
        userId: userInactive.id,
        rolId: rolStudent.id
    });
}, 40000);

afterAll(async () => {
    await sequelize.close();
    server.close();
});

global.request = require('supertest')(app);