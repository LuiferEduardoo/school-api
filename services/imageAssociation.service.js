const boom = require('@hapi/boom');

const { sequelize } = require('./../libs/sequelize');
const FilesRegistration = require('./filesRegistration.service');

const serviceFileRegistration = new FilesRegistration();

class ImageAssociation{
    async imageForId(imageId, model, include = null){
        const imageForId = await sequelize.models[model].findByPk(imageId, {
            include: include
        });
        if(!imageForId){
            throw boom.notFound('Archivo no encontrado');
        }
        return imageForId;
    }
    
    async fileId(id, model){
        return await this.imageForId(id, model, {
            model: sequelize.models.ImageRegistration,
            as: 'image',
            include: [
                {
                    model: sequelize.models.FileRegistration,
                    as: 'file'
                        // Puedes agregar condiciones adicionales si es necesario
                    }
                ]
        });
    }

    async createWithImage (req, association, data, folder){
        try {
            req.fields.fileType = 'image';
            req.fields.folder = folder;
            
            const createImages = [];
            const imagesFileRegistration = await serviceFileRegistration.fileUpload(req);
            for (const  imageUpload of imagesFileRegistration) {
                createImages.push(await sequelize.models[association].create({
                    imageId: imageUpload.id,
                    ...data
                }));
            }
            return createImages;
        } catch (error) {
            throw error
        }
    }

    async createOrUpdateWithId(ids, data, association, shape, idsImages=null){
        try {
            let dataReturn = []; 

            let counter = 0;
            const imagesIds = ids.split(",");
            for (const imageId of imagesIds){
                await this.imageForId(imageId, 'ImageRegistration');
                if(shape === 'create'){
                    const create = await sequelize.models[association].findOrCreate({ 
                        where: { imageId },
                        defaults: {
                            ...data
                        }
                    });
                    dataReturn.push(create[0]);
                }else if(shape === 'update'){
                    const imageUpdate = await this.imageForId(idsImages[counter], association);
                    dataReturn.push(await imageUpdate.update({imageId, ...data}));
                }
                counter++
            }
            return dataReturn; 
        } catch (error) {
            throw error
        }
    }
    async createOrAdd(req, association, data, folder, ids=null, model = null){
        try {
            if(req.files.files){
                return await this.createWithImage(req, association, 'create', data, folder)
            } else if(ids){
                return await this.createOrUpdateWithId(ids, data, association, 'create', model)
            }
            throw boom.badRequest('Tienes que pasar images o ids de imagenes para crearlas o agregarlas');
        } catch (error) {
            
        }
    }
    async update (association, data, idsNewImages, idsImages){
        try {
            return await this.createOrUpdateWithId(idsNewImages, data, association, 'update', idsImages)
        } catch (error) {
            throw error
        }
    }

    async delete(ids, association, eliminateImages, req){
        try {
            let counter = 0
            const eliminateImagesAssociationIds = Array.isArray(ids) ? ids : ids.split(",");
            const eliminateImagesArray = eliminateImages ? eliminateImages.split(',').map(item => item.trim() === 'true') : [];
            for(const eliminateImageAssociationId of eliminateImagesAssociationIds){
                try {
                    const imageAssociation = await sequelize.models[association].findByPk(eliminateImageAssociationId);
                    if (imageAssociation) {
                        await imageAssociation.destroy();
                        if (eliminateImagesArray[counter]) {
                            await serviceFileRegistration.handleFileDelete(imageAssociation.image.file.fileId, req);
                        }
                    }
                } catch (error){

                }
                counter++;
            }
        } catch (error) {
            throw error; 
        }
    }
}

module.exports = ImageAssociation;