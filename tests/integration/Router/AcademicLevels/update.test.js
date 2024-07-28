const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const {createCampus, createAcademicLevels} = require('../../helpers/createAcademicLevels');

let redisClient;
let tokenAdministrator;
let tokenStudentOne;

beforeAll(async () => {
    redisClient = new Redis();
    setRedisInstance(redisClient);

    tokenAdministrator = await loginUser('administrador@test.com', 'passwordAdministrador');
    tokenStudentOne = await loginUser('student1@test.com', 'passwordStudent1');

    await createCampus();

    for (let i = 0; i < 2; i++) {
        await createAcademicLevels(tokenAdministrator, 'idImage', true);
    }
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

const getAcademicLevels = async (id) => {
    return await request.get(`/api/v1/academic-levels/${id}`)
        .set('Authorization', `Bearer ${tokenAdministrator}`);
}

describe('should throw error', ()=> {
    test('should throw an error if the user does not have permission', async() =>{
        const res = await request.patch('/api/v1/academic-levels/1')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if it has no token', async() => {
        const res = await request.patch('/api/v1/academic-levels/1')
        expect(res.statusCode).toBe(401); 
    });

    test('should throw an error if it not found', async() => {
        const res = await request.patch('/api/v1/academic-levels/234')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(404); 
    });
});

describe('should update', ()=> {
    test('should update title, content, important and visible', async() => {
        const res = await request.patch('/api/v1/academic-levels/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .send({
                nameLevel: 'new name level',
                description: 'new description',
                levelCode: 2334,
                campusNumber: 2,
                modality: 'Virtual',
                educationalObjectives: 'new educational objectives',
                admissionRequirements: 'new admission requitements',
                educationDay: 'Tarde',
                visible: false,
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Nivel academico actualizado con éxito');
        const academicLevels = await getAcademicLevels(1);
        expect(academicLevels.body.nameLevel).toBe('new name level');
        expect(academicLevels.body.description).toBe('new description')
        expect(academicLevels.body.levelCode).toBe('2334');
        expect(academicLevels.body.campus.campusNumber).toBe(2);
        expect(academicLevels.body.modality.modality).toBe('Virtual');
        expect(academicLevels.body.educationalObjectives).toBe('new educational objectives');
        expect(academicLevels.body.admissionRequirements).toBe('new admission requitements');
        expect(academicLevels.body.educationDay.educationDay).toBe('Tarde');
        expect(academicLevels.body.visible).toBe(false);
    });

    test('should update image', async () => {
        const resOne = await request.patch('/api/v1/academic-levels/2')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .send({
                idImageEliminate: '2',
                idNewImage: '1',
            })
        expect(resOne.statusCode).toBe(200);
        const getAcademicLevelsOne = await getAcademicLevels(2);
        expect(getAcademicLevelsOne.body.imageAcademicLevels[0].imageId).toBe(1);
    })
});