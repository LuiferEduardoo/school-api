const { sequelize } = require('../../../libs/sequelize');
const { uploadFilesForUser } = require('./uploadFile');

const uploadBanners = async(token, banner) => {
    const images = await sequelize.models.ImageRegistration.findAll();
    if(images.length === 0) {
        for (let index = 0; index < 3; index++) {
            await uploadFilesForUser(token, true, 'image');
        }
    }

    const imagesToAdd = await sequelize.models.ImageRegistration.findAll();
    const ids = imagesToAdd.map(image => image.id);
    
    const res = await request
        .post(`/api/v1/banner/${banner}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            ids: ids.join(','),
            description: 'description1,description2,description3'
    })
}

module.exports = uploadBanners