const { sequelize } = require('./../libs/sequelize');
const boom = require('@hapi/boom');

class Transactional {
    async withTransaction(callback) {
        let transaction;
        try {
            transaction = await sequelize.transaction();
            const result = await callback(transaction);
            await transaction.commit();
            return result;
        } catch (error) {
            if (transaction) await transaction.rollback();
            throw error;
        }
    }
    async getElementById(id, model, include = null){
        return this.withTransaction(async (transaction) => {
            const element = await sequelize.models[model].findByPk(id, {
                include: include
            });
            if(!element){
                throw boom.notFound(`${model} no encontrado`);
            }
            return element;
        })
    }

    async getElementWithCondicional(model, where, message, include=null){
        const element = await sequelize.models[model].findOne({
            where: { ...where },
            include: include
        })
        if(!element){
            throw boom.unauthorized(message);
        }
        return element;
    }

    async getAllElements(model, where = null, include = null){
        return this.withTransaction(async (transaction) => {
            const elements = await sequelize.models[model].findAll({
                where: { ...where },
                include: include
            })
            return elements
        });
    }
    async checkModel(model, nameModel){
        try {
            const modelExist = await sequelize.isDefined(model);
            if(!modelExist){
                throw boom.notFound(`${nameModel} no existe`);
            }
        } catch(error){
            throw error
        }
    }
}

module.exports = Transactional;