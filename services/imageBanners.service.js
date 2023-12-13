const boom = require('@hapi/boom');

const { sequelize } = require('./../libs/sequelize');
const ImageAssociation = require('./imageAssociation.service');
const Transactional = require('./Transactional.service');

const serviceImageAssociation = new ImageAssociation();

class ImageBanners extends Transactional {

    async checkModel(model){
        try {
            const modelExist = await sequelize.isDefined(model);
            if(!modelExist){
                throw boom.notFound('Banner no existe');
            }
        } catch(error){
            throw error
        }
    }
    async bannerForId(id, banner, include){
        try {
            const bannerForId = await sequelize.models[banner].findByPk(id, {
                include: include
            });
            if(!bannerForId){
                throw boom.notFound('Banner no encontrado');
            }
            return bannerForId;
        } catch(error){
            throw error;
        }
    }
    async getBanners(id, banner){
        try {
            await this.checkModel(banner)
            const include = [{ association: 'imageBanner', include: [{ association: 'image', include: 'file' }] }]
            if(id){
                return await this.bannerForId(id, banner, include)
            }
            return await sequelize.models[banner].findAll({
                include: include
            });
        } catch(error){
            throw boom.notFound('Banner no encontrado');
        }

    }
    async create(req, data, banner){
        return this.withTransaction(async (transaction) => {
            await this.checkModel(banner);
            const createImages = await serviceImageAssociation.createOrAdd(req, 'ImageBanners', {userId: req.user.sub}, `banners/${banner}`, data.ids, null, {transaction});
            const description = data.description.split(",");
            const imagesBanner = [];
    
            let counter = 0;
            for (const createImage of createImages) {
                    imagesBanner.push(await sequelize.models[banner].create({
                    bannerId: createImage.id,
                    description: description[counter] 
                }, { transaction }));
                counter ++;
            }
            return imagesBanner;
        })
    }
    async update(req, data, banner){
        return this.withTransaction(async (transaction) => {
            await this.checkModel(banner);
            const updateBanner = [];
            const idsBanner = data.idsBanners ? data.idsBanners.split(',').map(id => parseInt(id, 10)) : [];
            const descriptions = data.description ? data.description.split(',') : [];
            const bannerForId = []
            
            let counter = 0;
            for (const idBanner of idsBanner ){
                const imageBanner = await this.bannerForId(idBanner, banner);
                bannerForId.push(imageBanner.bannerId);
                const dataUpdateInDataBase = {};
                if(descriptions[counter] != null){
                    dataUpdateInDataBase.description = descriptions[counter]
                }
                updateBanner.push(await imageBanner.update(dataUpdateInDataBase, { transaction }));
                counter ++;
            }
            return updateBanner;
        })
    }
    async delete(req, data, banner){
        return this.withTransaction(async (transaction) => {
            await this.checkModel(banner);
            const eliminateBannersIds = data.idsBanners.split(",");
            let bannersToDelete = [];
            let imagesToDeleteAssociation = [];
            for(const eliminateBannerId of eliminateBannersIds){
                const bannerToDelete = await this.bannerForId(eliminateBannerId, banner);
                imagesToDeleteAssociation.push(bannerToDelete.bannerId);
                bannerToDelete.destroy();
                bannersToDelete.push(bannerToDelete);
            }
            await serviceImageAssociation.delete(imagesToDeleteAssociation, 'ImageBanners', data.elimianteImages, req, { transaction });
            return {
                message: "banner borrado con exito",
                ids: eliminateBannersIds
            }
        });
    }
}

module.exports = ImageBanners;