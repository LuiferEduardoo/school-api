const { sequelize } = require('./../libs/sequelize');
const Transactional = require('./Transactional.service');
const boom = require('@hapi/boom');

const ContentManagement = require('./contentManagement.service')

const serviceContentManagement = new ContentManagement();

class Publications extends Transactional {

    async create(body, transaction){
        try {
            const createPublication = await serviceContentManagement.create(body, 'Publications', 'publicationId', transaction)
            return createPublication
        } catch (error) {
            throw error
        }
    }

    async upate(body, id, transaction){
        try{
            const updatePublication = await serviceContentManagement.upate(body, id, 'Publications', 'publicationId', transaction);
        } catch (error){
            throw error
        }
    }

    async delete(id, transaction){
        try {
            const deletePublicationClassification = await serviceContentManagement.delete(id, 'Publications', 'publicationId', transaction);
        } catch (error) {
            throw error
        }
    }
}

module.exports = Publications;