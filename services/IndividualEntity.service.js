const { sequelize } = require('./../libs/sequelize');
const Transactional = require('./Transactional.service');
const boom = require('@hapi/boom');


class IndividualEntity extends Transactional {

    async createIndividualEntity(membersToCreate, fieldNameIndividualEntity, elementId, modelIndividualEntity, fieldNameElement, optionalData, transaction){
        const individualEntityArray = Array.isArray(membersToCreate) ? membersToCreate : membersToCreate.split(',');
        let counter = 0;
        for(const individualEntity of individualEntityArray) {
            const create = await sequelize.models[modelIndividualEntity].create({
                [fieldNameElement]: elementId,
                [fieldNameIndividualEntity]: individualEntity,
                ...optionalData[counter],
            }, {transaction})
            counter ++;
        };
    }

    async deleteIndividualEntity(deleteAll, individualEntityToDelete, elementId, modelIndividualEntity, fieldNameElement, transaction){
        const deleteAllArray = deleteAll ? await this.getAllElements(modelIndividualEntity, {[fieldNameElement]: elementId}) : false;
        const idsEliminateIndividualEntityArray = deleteAllArray ? deleteAllArray.map(IndividualEntity => IndividualEntity.id) : Array.isArray(individualEntityToDelete) ? individualEntityToDelete : individualEntityToDelete.split(',');
        for(const idEliminateIndividualEntity of idsEliminateIndividualEntityArray){
            const getIndividualEntity = await this.getElementById(idEliminateIndividualEntity, modelIndividualEntity);
            if(getIndividualEntity[fieldNameElement] != elementId){
                throw boom.unauthorized();
            }
            await getIndividualEntity.destroy({transaction});
        }
    }

    async updateIndividualEntity(idsNewIndividualEntity, idsEliminateIndividualEntityArray, fieldNameIndividualEntity,  elementId, modelIndividualEntity, fieldNameElement, optionalData, transaction){
        if(idsNewIndividualEntity){
            await this.createIndividualEntity(idsNewIndividualEntity,fieldNameIndividualEntity, elementId, modelIndividualEntity, fieldNameElement, optionalData, transaction);
        }
        if(idsEliminateIndividualEntityArray){
            await this.deleteIndividualEntity(false, idsEliminateIndividualEntityArray, elementId, modelIndividualEntity, fieldNameElement, transaction);
        }
    }
}

module.exports = IndividualEntity;