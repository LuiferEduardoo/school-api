const { sequelize } = require('./../libs/sequelize');

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