const { sequelize } = require('../../../libs/sequelize');
const IndividualEntity = require('../../../services/IndividualEntity.service')

const InstitutionalProjects = sequelize.models.InstitutionalProjects;
const User = sequelize.models.User;
const Publications = sequelize.models.Publications;
const InstitutionalProjectsPublications = sequelize.models.InstitutionalProjectsPublications;

beforeAll(async () => {
    await sequelize.sync({ force: true });
    await InstitutionalProjects.create({
        title: "test InstitutionalProjects title",
        content: "test InstitutionalProjects content",
        link: "test-institutionalProjects-title",
        startedAt: "2022-09-01",
        createdAt: '2024-05-07',
        updatedAt: '2024-05-07'
    });
    await Publications.create({
        title: 'test Publications title',
        content: 'test Publication content',
        link: 'test-publication-title',
        reading_time: "00:01:00"
    });

    await InstitutionalProjectsPublications.create({
        publicationId: 1,
        InstitutionalProjectId: 1,
    });

    await User.create({
        name: 'test name',
        lastName: 'test lastName',
        username: 'testUsername',
        email: 'testemail@test.com',
        password: 'testPassword',
    });
    await User.create({
        name: 'test name two',
        lastName: 'test lastName two',
        username: 'testUsernameTwo',
        email: 'testemailtwo@test.com',
        password: 'testPasswordTwo',
    });
    await User.create({
        name: 'test name three',
        lastName: 'test lastName three',
        username: 'testUsernameThree',
        email: 'testemailthree@test.com',
        password: 'testPasswordThree',
    });
}, 40000);

afterAll(async () => {
    await sequelize.close();
});

describe('IndividualEntity', () => {
    let individualEntityService;

    beforeEach(() => {
        individualEntityService = new IndividualEntity();
    });

    describe('createIndividualEntity', () => {
        test('should create individual entities InstitutionalProjectsMember', async () => {
            const membersToCreate = '1,2,3';
            const fieldNameIndividualEntity = 'userId';
            const elementId = 1;
            const modelIndividualEntity = 'InstitutionalProjectsMember';
            const fieldNameElement = 'institutionalProjectsId';
            const optionalData = [
                {
                    isCoordinator: true
                },
                {
                    isCoordinator: false
                },
                {
                    isCoordinator: false
                }
            ];
    
            await individualEntityService.createIndividualEntity(
                membersToCreate, 
                fieldNameIndividualEntity, 
                elementId, 
                modelIndividualEntity, 
                fieldNameElement, 
                optionalData
            );
            const InstitutionalProjectsMember = await sequelize.models.InstitutionalProjectsMember.findAll();
    
            expect(InstitutionalProjectsMember.length).toBe(3);
            expect(InstitutionalProjectsMember[0].userId).toBe(1);
            expect(InstitutionalProjectsMember[1].userId).toBe(2);
            expect(InstitutionalProjectsMember[2].userId).toBe(3);
        }, 20000);
    
        test('should create individual entities InstitutionalProjectsPublicationsAuthors', async () => {
            const membersToCreate = '1,2,3';
            const fieldNameIndividualEntity = 'authorId';
            const elementId = 1;
            const modelIndividualEntity = 'InstitutionalProjectsPublicationsAuthors';
            const fieldNameElement = 'institutionalProjectsPublicationId';
    
            await individualEntityService.createIndividualEntity(
                membersToCreate, 
                fieldNameIndividualEntity, 
                elementId, 
                modelIndividualEntity, 
                fieldNameElement, 
                {}
            );
            const InstitutionalProjectsPublicationsAuthors = await sequelize.models.InstitutionalProjectsPublicationsAuthors.findAll();
    
            expect(InstitutionalProjectsPublicationsAuthors.length).toBe(3);
            expect(InstitutionalProjectsPublicationsAuthors[0].authorId).toBe(1);
            expect(InstitutionalProjectsPublicationsAuthors[1].authorId).toBe(2);
            expect(InstitutionalProjectsPublicationsAuthors[2].authorId).toBe(3);
        }, 20000);
    })

    describe('updateIndividualEntity', () => {
        test('update coordinator y the InstitutionalProjectsMember', async() => {
            const idsUpdateIndividualEntity = '2';
            const updateIsCoordinator = "true"
            const fieldNameIndividualEntity = 'institutionalProjectsId';
            const elementId = 1;
            const modelIndividualEntity = 'InstitutionalProjectsMember';

            await individualEntityService.updateIndividualEntity(null, null, idsUpdateIndividualEntity, updateIsCoordinator, fieldNameIndividualEntity, elementId, modelIndividualEntity);
            const InstitutionalProjectsMember = await sequelize.models.InstitutionalProjectsMember.findAll();
    
            expect(InstitutionalProjectsMember[1].isCoordinator).toBe(true);
        })
    });

    describe('deleteIndividualEntity', () => {

        describe('delete one IndividualEntity', () => {
            test('InstitutionalProjectsPublicationsAuthors', async() => {
                await individualEntityService.deleteIndividualEntity(false, '1', 1, 'InstitutionalProjectsPublicationsAuthors', 'institutionalProjectsPublicationId');

                const InstitutionalProjectsPublicationsAuthors = await sequelize.models.InstitutionalProjectsPublicationsAuthors.findAll();
                expect(InstitutionalProjectsPublicationsAuthors.length).toBe(2);
                expect(InstitutionalProjectsPublicationsAuthors[0].authorId).toBe(2);
            });

            test('InstitutionalProjectsMember', async() => {
                await individualEntityService.deleteIndividualEntity(false, '1', 1, 'InstitutionalProjectsMember', 'institutionalProjectsId');
                const InstitutionalProjectsMember = await sequelize.models.InstitutionalProjectsMember.findAll();
                expect(InstitutionalProjectsMember.length).toBe(2);
                expect(InstitutionalProjectsMember[0].userId).toBe(2);
            });
        });

        describe('delete all IndividualEntity', () => {
            test('InstitutionalProjectsPublicationsAuthors', async() => {
                await individualEntityService.deleteIndividualEntity(true, null, 1, 'InstitutionalProjectsPublicationsAuthors', 'institutionalProjectsPublicationId');
                const InstitutionalProjectsPublicationsAuthors = await sequelize.models.InstitutionalProjectsPublicationsAuthors.findAll();
                expect(InstitutionalProjectsPublicationsAuthors.length).toBe(0);
            });

            test('InstitutionalProjectsMember', async() => {
                await individualEntityService.deleteIndividualEntity(true, null, 1, 'InstitutionalProjectsMember', 'institutionalProjectsId');
                const InstitutionalProjectsMember = await sequelize.models.InstitutionalProjectsMember.findAll();
                expect(InstitutionalProjectsMember.length).toBe(0);
            });
        });
    })
});