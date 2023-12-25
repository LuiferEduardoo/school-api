const { sequelize } = require('../libs/sequelize');
const boom = require('@hapi/boom');
const Transactional = require('./Transactional.service');

const Publications = require('./publications.service');
const ImageAssociation = require('./imageAssociation.service');

const servicePublications = new Publications();
const serviceImageAssociation = new ImageAssociation();

class News extends Transactional {
    async getPublication(id, include = null){
        return this.withTransaction(async (transaction) => {
            const publication = await sequelize.models.NewsPublications.findByPk(id, {
                include: include
            });
                if(!publication){
                    throw boom.notFound('Noticia no encontrada');
                }
                return publication;
        })
    }

    async get(id){
        const include = [
            { association: 'publication', include: [
                {association: 'categories', include:[{association: 'categories', include: 'clasification'}]},
                {association:'subcategories', include:[{association: 'subcategories', include: 'clasification'}]},
                {association:'tags', include:[{association: 'tags', include: 'clasification'}]}
            ]},
            { association: 'imageNews', include: [{association: 'image', include: 'file'}] }
        ]
        return this.withTransaction(async (transaction) => {
            if(id){
                return await this.getPublication(id, include);
            }
            return await sequelize.models.NewsPublications.findAll({
                include: include
            });
        })
    }
    async create(req, body){
        return this.withTransaction(async (transaction) => {
            const createPublication = await servicePublications.create(body,transaction);
            const newsPublications = await sequelize.models.NewsPublications.create({publicationId: createPublication.id, userId: req.user.sub}, {transaction});
            const imagesNewsPublications = await serviceImageAssociation.createOrAdd(req, 'ImageNews', {newsPublicationsId: newsPublications.id}, `news`, body.idImage, transaction)
            return {
                message: 'Noticia creada con exito'
            }
        })
    }

    async update(req, body, id){
        return this.withTransaction(async (transaction) => {
            const getNewsPublications = await this.getPublication(id);
            const updateNewsPublications = await servicePublications.upate(body, getNewsPublications.publicationId, transaction);
            const updateimagesNewsPublications = await serviceImageAssociation.update(req, 'ImageNews', {newsPublicationsId: id}, body.idNewImage, `news`, body.idImageEliminate, body.eliminateImage, transaction);
            return {
                message: 'Noticia actualizada con exito'
            }
        })
    }

    async delete(id, body, req){
        return this.withTransaction(async (transaction) => {
            const getNewsPublications = await this.getPublication(id, ['imageNews']);
            const idsImagesEliminate = getNewsPublications.imageNews.map(news => (news.id));
            const deleteimagesNewsPublications = await serviceImageAssociation.delete(idsImagesEliminate, 'ImageNews', body.elimianteImages, req, transaction);
            await getNewsPublications.destroy({transaction});
            const deletePublication = await servicePublications.delete(getNewsPublications.publicationId, transaction);
            return {
                message: 'Noticia borra con exito',
                id: id
            }
        });
    }
}

module.exports = News;