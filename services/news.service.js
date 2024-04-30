const { sequelize } = require('../libs/sequelize');
const boom = require('@hapi/boom');
const Transactional = require('./Transactional.service');

const Publications = require('./publications.service');
const ImageAssociation = require('./imageAssociation.service');

const servicePublications = new Publications();
const serviceImageAssociation = new ImageAssociation();

class News extends Transactional {
    async get(id, req){
        const where = this.checkPermissionToGet(req)
        const query = this.queryParameterPagination(req.query);
        const { search, important, visible } = req.query;
        const whereClause = {};
        const dataFilter = ['$publication.title$', '$publication.categories.categories.clasification.name$', '$publication.subcategories.subcategories.clasification.name$', '$publication.tags.tags.clasification.name$']
        const include = [
            { association: 'publication', where: where, order: this.order, include: [
                {association: 'categories', include:[{association: 'categories', include: 'clasification'}]},
                {association:'subcategories', include:[{association: 'subcategories', include: 'clasification'}]},
                {association:'tags', include:[{association: 'tags', include: 'clasification'}]}
            ]},
            { association: 'imageNews', include: [{association: 'image', include: 'file'}] }
        ]
        this.querySearch(dataFilter, search, whereClause);

        this.handleElementPrivacy(req, where, '$publication.visible$', visible);
        
        if (important) {
            whereClause['$publication.important$'] = important;
        }

        return this.withTransaction(async (transaction) => {
            if(id){
                return await this.getElementWithCondicional('NewsPublications', include, {id: id});
            }
            return await this.getAllElements('NewsPublications', whereClause, include, null, query )
        })
    }
    async create(req, body){
        return this.withTransaction(async (transaction) => {
            const createPublication = await servicePublications.create(body,transaction);
            const newsPublications = await sequelize.models.NewsPublications.create({publicationId: createPublication.id, userId: req.user.sub}, {transaction});
            const imagesNewsPublications = await serviceImageAssociation.createOrAdd(req, 'ImageNews', {newsPublicationsId: newsPublications.id}, `news/${newsPublications.id}`, body.idImage, transaction)
            return {
                message: 'Noticia creada con exito'
            }
        })
    }

    async update(req, body, id){
        return this.withTransaction(async (transaction) => {
            const getNewsPublications = await this.getElementById(id, 'NewsPublications');
            const updateNewsPublications = await servicePublications.upate(body, getNewsPublications.publicationId, transaction);
            const updateimagesNewsPublications = await serviceImageAssociation.update(req, 'ImageNews', {newsPublicationsId: id}, body.idNewImage, `news/${id}`, body.idImageEliminate, body.eliminateImage, transaction);
            return {
                message: 'Noticia actualizada con exito'
            }
        })
    }

    async delete(id, body, req){
        return this.withTransaction(async (transaction) => {
            const getNewsPublications = await this.getElementById(id, 'NewsPublications', ['imageNews']);
            const idsImagesEliminate = getNewsPublications.imageNews.map(news => (news.id));
            const deleteimagesNewsPublications = await serviceImageAssociation.delete(idsImagesEliminate, 'ImageNews', body.eliminateImage, req, transaction);
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