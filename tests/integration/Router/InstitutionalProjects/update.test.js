const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const createInstitutionalProjects = require('../../helpers/createInstitutionalProjects');
const verifyClassifications = require('../../helpers/verifyClassifications');

let redisClient;
let tokens = {};

const setupTokens = async () => {
    tokens = {
        administrator: await loginUser('administrador@test.com', 'passwordAdministrador'),
        coordinator: await loginUser('coordinator@test.com', 'passwordCoordinator'),
        studentOne: await loginUser('student1@test.com', 'passwordStudent1'),
        studentTwo: await loginUser('student2@test.com', 'passwordStudent2'),
    };
};

const createProjectsAndPublication = async () => {
    const isVisible = [false, true];

    for (const visible of isVisible) {
        await createInstitutionalProjects(tokens.administrator, 'idImage', visible);
    }

    await request
        .post(`/api/v1/institutional-projects/1`)
        .set('Authorization', `Bearer ${tokens.administrator}`)
        .send({
            title: 'this is title',
            content: 'this is content',
            categories: 'category1,category2,category3',
            subcategories: 'subcategory1,subcategory2,subcategory3',
            tags: 'tag1,tag2,tag3',
            idImage: '1',
            authors: '6'
        });
};

beforeAll(async () => {
    redisClient = new Redis();
    setRedisInstance(redisClient);

    await setupTokens();
    await createProjectsAndPublication();
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

const getInstitutionalProject = async (id) => {
    return await request.get(`/api/v1/institutional-projects/${id}`)
        .set('Authorization', `Bearer ${tokens.administrator}`);
};

const getPublicationProject = async (id) => {
    return await request.get(`/api/v1/institutional-projects/1/publication/${id}`)
        .set('Authorization', `Bearer ${tokens.administrator}`);
};

describe('Institutional Projects and Publications', () => {
    describe('Error Handling', () => {
        const testCases = [
            { description: 'should throw an error if the user does not have permission', endpoint: '/api/v1/institutional-projects/1', token: 'studentOne', statusCode: 401 },
            { description: 'should throw an error if it has no token', endpoint: '/api/v1/institutional-projects/1', token: null, statusCode: 401 },
            { description: 'should throw an error if not found', endpoint: '/api/v1/institutional-projects/234', token: 'administrator', statusCode: 404 },
        ];

        testCases.forEach(({ description, endpoint, token, statusCode }) => {
            test(description, async () => {
                const res = await request.patch(endpoint)
                    .set('Authorization', token ? `Bearer ${tokens[token]}` : '');
                expect(res.statusCode).toBe(statusCode);
            });
        });
    });

    describe('Update Institutional Projects', () => {
        test('should update title, content, important, and visible', async () => {
            const res = await request.patch('/api/v1/institutional-projects/1')
                .set('Authorization', `Bearer ${tokens.administrator}`)
                .send({
                    title: 'new title',
                    content: 'new content',
                    visible: false,
                    important: true
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Proyecto institucional actualizado con exito');

            const project = await getInstitutionalProject(1);
            const { title, link, content, visible, important } = project.body;
            expect(title).toBe('new title');
            expect(link).toBe('new-title');
            expect(content).toBe('new content');
            expect(visible).toBe(false);
            expect(important).toBe(true);
        });

        test('should update classifications', async () => {
            const res = await request.patch('/api/v1/institutional-projects/1')
                .set('Authorization', `Bearer ${tokens.administrator}`)
                .send({
                    idsEliminateCategories: '1',
                    idsEliminateSubcategories: '1',
                    idsEliminateTags: '1',
                    categories: 'newCategory',
                    subcategories: 'newSubcategory',
                    tags: 'newTags'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Proyecto institucional actualizado con exito');

            const project = await getInstitutionalProject(1);
            const classifications = [
                { list: project.body.categories.map(c => c.categories.clasification.name), new: 'newCategory', delete: 'category1' },
                { list: project.body.subcategories.map(s => s.subcategories.clasification.name), new: 'newSubcategory', delete: 'subcategory1' },
                { list: project.body.tags.map(t => t.tags.clasification.name), new: 'newTags', delete: 'tag1' }
            ];

            classifications.forEach(({ list, new: newClassification, delete: deleteClassification }) => {
                const { isElementDelete, isNewClassification } = verifyClassifications(list, newClassification, deleteClassification);
                expect(isElementDelete).toBe(false);
                expect(isNewClassification).toBe(true);
            });
        });

        test('should update members', async () => {
            const updateMemberRes = await request.patch('/api/v1/institutional-projects/1')
                .set('Authorization', `Bearer ${tokens.administrator}`)
                .send({
                    idsEliminateMembers: '2',
                    idsNewMembers: '3',
                    isCoordinator: 'false'
                });

            expect(updateMemberRes.statusCode).toBe(200);
            let project = await getInstitutionalProject(1);
            expect(project.body.members.length).toBe(3);

            project.body.members.forEach(m => {
                if (m.userId === 1) {
                    expect(m.isCoordinator).toBe(true);
                } else if (m.userId === 6) {
                    expect(m.isCoordinator).toBe(false);
                }
            });

            const updateMemberResTwo = await request.patch('/api/v1/institutional-projects/1')
                .set('Authorization', `Bearer ${tokens.administrator}`)
                .send({
                    updateMembers: '3',
                    updateIsCoordinator: 'false',
                });

            expect(updateMemberResTwo.statusCode).toBe(200);
            project = await getInstitutionalProject(1);
            project.body.members.forEach(m => {
                if (m.userId === 1) {
                    expect(m.isCoordinator).toBe(true);
                } else if (m.userId === 6) {
                    expect(m.isCoordinator).toBe(false);
                } else {
                    expect(m.userId).toBe(3);
                    expect(m.isCoordinator).toBe(false);
                }
            });
        });

        test('should update image', async () => {
            const updateImageRes = await request.patch('/api/v1/institutional-projects/2')
                .set('Authorization', `Bearer ${tokens.administrator}`)
                .send({
                    idImageEliminate: '2',
                    idNewImage: '1',
                });

            expect(updateImageRes.statusCode).toBe(200);

            const project = await getInstitutionalProject(2);
            expect(project.body.ImageInstitutionalProjects[0].imageId).toBe(1);
        });
    });

    describe('Update Publications', () => {
        test('should update title, content, important, and visible', async () => {
            const res = await request.patch('/api/v1/institutional-projects/1/1')
                .set('Authorization', `Bearer ${tokens.administrator}`)
                .send({
                    title: 'new title',
                    content: 'new content',
                    visible: false,
                    important: true
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Publicación de proyecto institucional actualizado con exito');

            const publication = await getPublicationProject(1);
            const { title, link, content, visible, important } = publication.body.publication;
            expect(title).toBe('new title');
            expect(link).toBe('new-title');
            expect(content).toBe('new content');
            expect(visible).toBe(false);
            expect(important).toBe(true);
        });

        test('should update classifications', async () => {
            const res = await request.patch('/api/v1/institutional-projects/1/1')
                .set('Authorization', `Bearer ${tokens.coordinator}`)
                .send({
                    idsEliminateCategories: '1',
                    idsEliminateSubcategories: '1',
                    idsEliminateTags: '1',
                    categories: 'newCategory',
                    subcategories: 'newSubcategory',
                    tags: 'newTags'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Publicación de proyecto institucional actualizado con exito');

            const publication = await getPublicationProject(1);
            const classifications = [
                { list: publication.body.publication.categories.map(c => c.categories.clasification.name), new: 'newCategory', delete: 'category1' },
                { list: publication.body.publication.subcategories.map(s => s.subcategories.clasification.name), new: 'newSubcategory', delete: 'subcategory1' },
                { list: publication.body.publication.tags.map(t => t.tags.clasification.name), new: 'newTags', delete: 'tag1' }
            ];

            classifications.forEach(({ list, new: newClassification, delete: deleteClassification }) => {
                const { isElementDelete, isNewClassification } = verifyClassifications(list, newClassification, deleteClassification);
                expect(isElementDelete).toBe(false);
                expect(isNewClassification).toBe(true);
            });
        });

        test('should update authors', async () => {
            const updateAuthorsResOne = await request.patch('/api/v1/institutional-projects/1/1')
                .set('Authorization', `Bearer ${tokens.administrator}`)
                .send({ idsEliminateAuthors: '2' });

            expect(updateAuthorsResOne.statusCode).toBe(200);
            let publication = await getPublicationProject(1);
            expect(publication.body.InstitutionalProjectsPublicationsAuthors.length).toBe(1);
            expect(publication.body.InstitutionalProjectsPublicationsAuthors[0].author.userId).toBe(1);

            const updateAuthorsResTwo = await request.patch('/api/v1/institutional-projects/1/1')
                .set('Authorization', `Bearer ${tokens.administrator}`)
                .send({ idsNewAuthors: '6' });

            expect(updateAuthorsResTwo.statusCode).toBe(200);
            publication = await getPublicationProject(1);
            expect(publication.body.InstitutionalProjectsPublicationsAuthors.length).toBe(2);
            expect(publication.body.InstitutionalProjectsPublicationsAuthors[0].author.userId).toBe(1);
            expect(publication.body.InstitutionalProjectsPublicationsAuthors[1].author.userId).toBe(6);
        });

        test('should update image', async () => {
            const updateImageRes = await request.patch('/api/v1/institutional-projects/1/1')
                .set('Authorization', `Bearer ${tokens.studentOne}`)
                .send({
                    idImageEliminate: '1',
                    idNewImage: '2',
                });

            expect(updateImageRes.statusCode).toBe(200);
            const publication = await getPublicationProject(1);
            expect(publication.body.ImageInstitutionalProjectPublication[0].imageId).toBe(2);
        });
    });
});