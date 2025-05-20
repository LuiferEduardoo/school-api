const { sequelize } = require('./../libs/sequelize');
const Transactional = require('./Transactional.service');
const boom = require('@hapi/boom');

const generateLink = require('./../utils/manipulation/link')
const readingTime = require('./../utils/manipulation/readingTime')
const ClassificationAssociation = require('./classificationAssociation.service');

const serviceClassificationAssociation = new ClassificationAssociation();

class ContentManagement extends Transactional {
    async create(body, model, nameModel, transaction){
        try {
            const link = await generateLink(body.title, model, sequelize);
            const createContentManagement = await sequelize.models[model].create({...body, link: link, reading_time:readingTime(body.content)}, {transaction});
            const createClassification = await serviceClassificationAssociation.createClassificationOfModel(body.categories, body.subcategories, body.tags, model, {[nameModel]: createContentManagement.id}, transaction);
            return createContentManagement
        } catch (error) {
            throw error
        }
    }

    async upate(body, id, model, nameModel, transaction){
        try{
            const contentManagement = await this.getElementById(id, model);
            if(body.title){
                body.link = await generateLink(body.title, model, sequelize);
            }
            const updateContentManagement = await contentManagement.update(body, {transaction});
            const updateContentManagementClassification = await serviceClassificationAssociation.updateClassificationModelType(body.categories, body.subcategories, body.tags, body.idsEliminateCategories, body.idsEliminateSubcategories, body.idsEliminateTags, model, {[nameModel]: contentManagement.id}, nameModel, id, transaction);
        } catch (error){
            throw error
        }
    }

    async delete(id, model, fieldNameElement, transaction){
        try {
            const contentManagement = await this.getElementById(id, model);
            const deleteContentManagementClassification = await serviceClassificationAssociation.deleteClassificationOfModel(null, null, null, model, transaction, contentManagement.id, fieldNameElement, true);
            const deleteContentManagement = await contentManagement.destroy({transaction})
        } catch (error) {
            throw error
        }
    }
}

module.exports = ContentManagement;