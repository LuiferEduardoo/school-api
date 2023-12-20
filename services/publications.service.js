const { sequelize } = require('./../libs/sequelize');
const Transactional = require('./Transactional.service');
const boom = require('@hapi/boom');

const generateLink = require('./../utils/manipulation/link')
const readingTime = require('./../utils/manipulation/readingTime')
const ClassificationAssociation = require('./classificationAssociation.service');

const serviceClassificationAssociation = new ClassificationAssociation();

class Publications extends Transactional {
    async getPublication(id, include = null){
        return this.withTransaction(async (transaction) => {
            const publication = await sequelize.models.Publications.findByPk(id, {
                include: include
            });
                if(!publication){
                    throw boom.notFound('Publicación no encontrada');
                }
                return publication;
        })
    }

    async create(body, transaction){
        try {
            const link = await generateLink(body.title, 'Publications', sequelize);
            const createPublication = await sequelize.models.Publications.create({...body, link: link, reading_time:readingTime(body.content)}, {transaction});
            const createClassification = await serviceClassificationAssociation.createClassificationOfModel(body.categories, body.subcategories, body.tags, 'Publications', {publicationId: createPublication.id}, transaction);
            return createPublication
        } catch (error) {
            throw error
        }
    }

    async upate(body, id, transaction){
        try{
            const publication = await this.getPublication(id);
            if(body.title){
                body.link = await generateLink(body.title, 'Publications', sequelize);
            }
            const updatePublication = await publication.update(body, {transaction});
            const updatePublicationClassification = await serviceClassificationAssociation.updateClassificationModelType(body.categories, body.subcategories, body.tags, body.idsEliminateCategories, body.idsEliminateSubcategories, body.idsEliminateTags, 'Publications', {publicationId: publication.id}, id, transaction);
        } catch (error){
            throw error
        }
    }

    async delete(id, transaction){
        try {
            const publication = await this.getPublication(id);
            const deletePublicationClassification = await serviceClassificationAssociation.deleteClassificationOfModel(null, null, null, 'Publications', transaction, publication.id, true);
            const deletePublication = await publication.destroy({transaction})
        } catch (error) {
            throw error
        }
    }
}

module.exports = Publications;