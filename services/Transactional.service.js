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
}

module.exports = Transactional;