const boom = require('@hapi/boom');

const { sequelize } = require('./../libs/sequelize');
const Transactional = require('./Transactional.service');
const FilesRegistration = require('./filesRegistration.service');

const serviceFileRegistration = new FilesRegistration();

class ImageAssociation extends Transactional{
    async imageForId(imageId, model, include = null){
        const imageForId = await sequelize.models[model].findByPk(imageId, {
            include: include
        });
        if(!imageForId){
            throw boom.notFound('Archivo no encontrado');
        }
        return imageForId;
    }

    async createWithImage (req, association, data, folder, transaction){
        try {
            req.fields.fileType = 'image';
            req.fields.folder = folder;
            const createImages = [];
            const fileArray = Array.isArray(req.files.files) ? req.files.files : [req.files.files]
            const isPublic = fileArray.map(map => true);
            req.fields.isPublic = isPublic;
            const imagesFileRegistration = await serviceFileRegistration.fileUpload(req, transaction);
            for (const  imageUpload of imagesFileRegistration) {
                createImages.push(await sequelize.models[association].create({
                    imageId: imageUpload.id,
                    ...data
                }, {transaction}));
            }
            return createImages;
        } catch (error) {
            throw error
        }
    }

    async createOrAddWithId(ids, data, association, transaction, addIdImage){
        try {
            let dataReturn = []; 
            let counter = 0;
            const imagesIds = ids.split(",");
            for (const imageId of imagesIds){
                await this.imageForId(imageId, 'ImageRegistration');
                let create;
                if(addIdImage){
                    create = await sequelize.models[association].create({ 
                        ...data,
                        imageId,
                    }, {transaction});
                } else {
                    create = await sequelize.models[association].findOrCreate({ 
                        where: { imageId },
                        defaults: {
                            ...data
                        }, 
                        transaction: transaction
                    });
                }
                dataReturn.push(addIdImage ? create : create[0]);
                counter++
            }
            return dataReturn; 
        } catch (error) {
            throw error
        }
    }
    async createOrAdd(req, association, data, folder, ids=null, transaction, addIdImage=false){
        try {
            if(req?.files?.files){
                return await this.createWithImage(req, association, data, folder, transaction)
            } else if(ids){
                return await this.createOrAddWithId(ids, data, association, transaction, addIdImage)
            }
            throw boom.badRequest('Tienes que pasar images o ids de imagenes para crearlas o agregarlas');
        } catch (error) {
            throw error
        }
    }

    async delete(ids, association, eliminateImages, req, transaction){
        try {
            let counter = 0
            const eliminateImagesAssociationIds = Array.isArray(ids) ? ids : ids.split(",");
            const eliminateImagesArray = typeof eliminateImages === 'boolean' ? [eliminateImages] : eliminateImages ? eliminateImages.split(',').map(item => item.trim() === 'true') : [];
            for(const eliminateImageAssociationId of eliminateImagesAssociationIds){
                try {
                    const imageAssociation = await sequelize.models[association].findByPk(eliminateImageAssociationId, {
                        include: 'image'
                    });
                    if (imageAssociation) {
                        await imageAssociation.destroy();
                        if (eliminateImagesArray[counter]) {
                            await serviceFileRegistration.handleFileDelete(imageAssociation.image.fileId, req);
                        }
                    }
                } catch (error) {
                    
                }
                counter++;
            }
        } catch (error) {
            throw error; 
        }
    }

    async update (req, association, data, idsNewImages, folder, idsEliminate, eliminateImages, transaction){
        try {
            if(req?.files?.files){
                await this.createWithImage(req, association, data, folder, transaction)
            } if(idsNewImages) {
                await this.createOrAddWithId(idsNewImages, data, association, transaction)
            } if(idsEliminate){
                await this.delete(idsEliminate, association, eliminateImages, req, transaction)
            }
        } catch (error) {
            throw error
        }
    }

    async updateInDataBase(req, association, idImage, idNewImage, folder, transaction){
        if(idImage){
            let idUpdate;
            if(req.files.files){
                req.fields.fileType = 'image';
                req.fields.folder = folder;
                req.fields.isPublic = [true]
                const imagesFileRegistration = await serviceFileRegistration.fileUpload(req);
                idUpdate = imagesFileRegistration[0].id
            } else if(idNewImage){
                try{
                    await this.imageForId(idNewImage, 'ImageRegistration');
                    idUpdate = idNewImage
                }
                catch (error) {
                    throw error
                }
            }
            const imageAssociation = await this.getElementWithCondicional(association, [], {imageId: idImage});
            imageAssociation.update({imageId: idUpdate})
        }
    }
}

module.exports = ImageAssociation;