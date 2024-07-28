const { sequelize } = require('../../../libs/sequelize');
const { uploadFilesForUser } = require('./uploadFile');
const fileGenerator = require('./fileGenerator');

const createInstitutionalProjects = async(token, typeImage, visible=true) => {
    let res;

    const title = 'example title';
    const content = 'example content';
    const categories = 'category1,category2,category3';
    const subcategories = 'subcategory1,subcategory2,subcategory3';
    const tags = 'tag1,tag2,tag3';
    const startedAt = '2024-06-03';
    const members = '1,3,6';
    const isCoordinator = 'true, false, false';

    if(typeImage === 'idImage'){
        await uploadFilesForUser(token, true, 'image');
        const imagesToAdd = await sequelize.models.ImageRegistration.findAll();
        const ids = imagesToAdd.map(image => image.id);
        const idImage = String(ids[ids.length - 1]);
        res = await request
            .post(`/api/v1/institutional-projects`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title,
                content,
                categories,
                subcategories,
                tags,
                idImage,
                startedAt,
                members,
                isCoordinator
            })
    } else {
        const fileBuffer = await fileGenerator('image');
        res = await request
            .post(`/api/v1/institutional-projects`)
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'multipart/form-data')
            .field('title', title)
            .field('content', content)
            .field('categories', categories)
            .field('subcategories', subcategories)
            .field('tags', tags)
            .field('startedAt', startedAt)
            .field('members', members)
            .field('isCoordinator', isCoordinator)
            .attach('files', fileBuffer, 'fake-image.png');
    }
    if(!visible){
        const institutionalProjects = await sequelize.models.InstitutionalProjects.findAll();
        await institutionalProjects[institutionalProjects.length - 1].update({visible: false});
    }
    return res;
}

module.exports = createInstitutionalProjects;