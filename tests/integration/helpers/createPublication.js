const { sequelize } = require('../../../libs/sequelize');
const { uploadFilesForUser } = require('./uploadFile');
const fileGenerator = require('./fileGenerator');

const uploadBanners = async(token, endpoint, typeImage, visible=true) => {
    let res;

    const title = 'example title';
    const content = 'example content';
    const categories = 'category1,category2,category3';
    const subcategories = 'subcategory1,subcategory2,subcategory3';
    const tags = 'tag1,tag2,tag3';

    if(typeImage === 'idImage'){
        await uploadFilesForUser(token, true, 'image');
        const imagesToAdd = await sequelize.models.ImageRegistration.findAll();
        const ids = imagesToAdd.map(image => image.id);
        const idImage = String(ids[ids.length - 1]);
        res = await request
            .post(`/api/v1/${endpoint}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title,
                content,
                categories,
                subcategories,
                tags,
                idImage
            })
    } else {
        const fileBuffer = await fileGenerator('image');
        res = await request
            .post(`/api/v1/${endpoint}`)
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'multipart/form-data')
            .field('title', title)
            .field('content', content)
            .field('categories', categories)
            .field('subcategories', subcategories)
            .field('tags', tags)
            .attach('files', fileBuffer, 'fake-image.png');
    }

    if(!visible){
        const publication = await sequelize.models.Publications.findAll();
        await publication[publication.length - 1].update({visible: false});
    }
    return res;
}

module.exports = uploadBanners