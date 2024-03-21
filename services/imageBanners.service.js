const { sequelize } = require('./../libs/sequelize');
const ImageAssociation = require('./imageAssociation.service');
const Transactional = require('./Transactional.service');

const serviceImageAssociation = new ImageAssociation();

class ImageBanners extends Transactional {
    async get(id, banner, req){
        return this.withTransaction(async (transaction) => {
            const query = this.queryParameterPagination(req.query);
            const include = [{ association: 'imageBanner', include: [{ association: 'image', include: 'file' }] }]
            await this.checkModel(banner, 'Banner')
            if(id){
                return await this.getElementWithCondicional(banner, include, {id: id})
            }
            return await this.getAllElements(banner, {}, include, null, query)
        })
    }
    async create(req, data, banner){
        return this.withTransaction(async (transaction) => {
            await this.checkModel(banner, 'Banner');
            const createImages = await serviceImageAssociation.createOrAdd(req, 'ImageBanners', {userId: req.user.sub}, `banners/${banner}`, data.ids, null, transaction);
            const description = data.description ? data.description.split(",") : [];
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
            await this.checkModel(banner, 'Banner');
            const updateBanner = [];
            const idsBanner = data.idsBanners ? data.idsBanners.split(',').map(id => parseInt(id, 10)) : [];
            const descriptions = data.description ? data.description.split(',') : [];
            const bannerForId = []
            
            let counter = 0;
            for (const idBanner of idsBanner ){
                const imageBanner = await this.getElementById(idBanner, banner);
                bannerForId.push(imageBanner.bannerId);
                const dataUpdateInDataBase = {};
                if(descriptions[counter] != null){
                    dataUpdateInDataBase.description = descriptions[counter]
                }
                updateBanner.push(await imageBanner.update(dataUpdateInDataBase, transaction ));
                counter ++;
            }
            return updateBanner;
        })
    }
    async delete(req, data, banner){
        return this.withTransaction(async (transaction) => {
            await this.checkModel(banner, 'Banner');
            const eliminateBannersIds = data.idsBanners.split(",");
            let bannersToDelete = [];
            let imagesToDeleteAssociation = [];
            for(const eliminateBannerId of eliminateBannersIds){
                const bannerToDelete = await this.getElementById(eliminateBannerId, banner);
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