const Redis = require('ioredis-mock');
const { setRedisInstance } = require('../../../../config/redisConfigToken');
const loginUser = require('../../helpers/loginUser');
const createPublication = require('../../helpers/createPublication');
const verifyClassifications = require('../../helpers/verifyClassifications');
const fileGenerator = require('../../helpers/fileGenerator');

let redisClient;
let tokenAdministrator;
let tokenStudentOne;

beforeAll(async () => {
    redisClient = new Redis();
    setRedisInstance(redisClient);

    tokenAdministrator = await loginUser('administrador@test.com', 'passwordAdministrador');
    tokenStudentOne = await loginUser('student1@test.com', 'passwordStudent1');


    for (let i = 0; i < 2; i++) {
        await createPublication(tokenAdministrator, 'news', 'idImage', true);
    }
});

afterAll(() => {
    redisClient.flushall();
    redisClient.disconnect();
});

const getNews = async (id) => {
    return await request.get(`/api/v1/news/${id}`)
        .set('Authorization', `Bearer ${tokenAdministrator}`);
}

describe('should throw error', ()=> {
    test('should throw an error if the user does not have permission', async() =>{
        const res = await request.patch('/api/v1/news/1')
            .set('Authorization', `Bearer ${tokenStudentOne}`);
        expect(res.statusCode).toBe(401);
    });

    test('should throw an error if it has no token', async() => {
        const res = await request.patch('/api/v1/news/1')
        expect(res.statusCode).toBe(401); 
    });

    test('should throw an error if it not found', async() => {
        const res = await request.patch('/api/v1/news/234')
            .set('Authorization', `Bearer ${tokenAdministrator}`);
        expect(res.statusCode).toBe(404); 
    });
});

describe('should update', ()=> {
    test('should update title, content, important and visible', async() => {
        const res = await request.patch('/api/v1/news/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .send({
                title: 'news title',
                content: 'news content',
                visible: false,
                important: true
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Noticia actualizada con exito');
        const news = await getNews(1);
        expect(news.body.publication.title).toBe('news title');
        expect(news.body.publication.link).toBe('news-title')
        expect(news.body.publication.content).toBe('news content');
        expect(news.body.publication.visible).toBe(false);
        expect(news.body.publication.important).toBe(true);
    });

    test('should update classifications', async() => {
        const res = await request.patch('/api/v1/news/1')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .send({
                idsEliminateCategories: '1',
                idsEliminateSubcategories: '1',
                idsEliminateTags: '1',
                categories: 'newCategory',
                subcategories: 'newSubcategory',
                tags: 'newTags'
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Noticia actualizada con exito');
        const news = await getNews(1);
        const nameCategoriesList = news.body.publication.categories.map(categorie => categorie.categories.clasification.name);
        const nameSubcategiesList = news.body.publication.subcategories.map(subcategorie => subcategorie.subcategories.clasification.name);
        const nameTagsList = news.body.publication.tags.map(tag => tag.tags.clasification.name);
        const classifications = [
            {
                classificationList: nameCategoriesList,
                newClassification: 'newCategory',
                classificationDelete: 'category1',
            }, 
            {
                classificationList: nameSubcategiesList,
                newClassification: 'newSubcategory',
                classificationDelete: 'subcategory1',
            }, 
            {
                classificationList: nameTagsList,
                newClassification: 'newTags',
                classificationDelete: 'tag1',
            }
        ];

        classifications.forEach(classification => {
            const verifyClassificationsExisting = verifyClassifications(classification.classificationList, classification.newClassification, classification.classificationDelete);
            expect(verifyClassificationsExisting.isElementDelete).toBe(false);
            expect(verifyClassificationsExisting.isNewClassification).toBe(true);
        });
    })

    test('should update image', async () => {
        const resOne = await request.patch('/api/v1/news/2')
            .set('Authorization', `Bearer ${tokenAdministrator}`)
            .send({
                idImageEliminate: '2',
                idNewImage: '1',
            })
        expect(resOne.statusCode).toBe(200);
        const getNewsOne = await getNews(2);
        expect(getNewsOne.body.imageNews[0].imageId).toBe(1);
    })
})


