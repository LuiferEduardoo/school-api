const boom = require('@hapi/boom');

const { sequelize } = require('./../libs/sequelize');
const Transactional = require('./Transactional.service');

class Classification extends Transactional {

    async getClassification(model, classificationId, include=null){
        return this.withTransaction(async (transaction) => {
        const classification = await sequelize.models[model].findByPk(classificationId, {
            include: include
        });
            if(!classification){
                throw boom.notFound('Clasificación no encontrada');
            }
            return classification;
        })
    }

    async createClassification(name, transaction){
        try {
            const createClassification = await sequelize.models.Clasification.findOrCreate({
                where: { name: name },
                transaction: transaction
            });
            return createClassification[0];
        } catch (error) {
            throw error
        }
    }

    async deleteClassification(classificationId, transaction){
        try {
            const getClassification = await this.getClassification('Clasification', classificationId);
            getClassification.destroy({transaction});
        } catch (error) {
        }
    }
}

module.exports = Classification;