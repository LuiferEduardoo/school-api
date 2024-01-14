const { sequelize } = require('./../libs/sequelize');
const boom = require('@hapi/boom');
const { superAdmin } = require('../middlewares/auth.handler'); 

class Transactional {
    constructor(){
        this.order = [['important', 'DESC'], ['createdAt', 'DESC']];
        this.includeClassification = [
            {association: 'categories', include:[{association: 'categories', include: 'clasification'}]},
            {association:'subcategories', include:[{association: 'subcategories', include: 'clasification'}]},
            {association:'tags', include:[{association: 'tags', include: 'clasification'}]}
        ];
    }
    queryParameter(query){
        const { limit, offset } = query;
        let queryToReturn = {}
        queryToReturn.limit = limit || undefined;
        queryToReturn.offset = offset || undefined;
        return queryToReturn;
    }

    checkPermissionToGet(req, property = 'visible'){
        const where = req.user ? superAdmin.includes(req.user.role) ? {} : {[property]: true} : {[property]: true};
        return where;
    }

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
    async getElementById(id, model, include = null, where = {}, order = null, query = {}){
        return this.withTransaction(async (transaction) => {
            const element = await sequelize.models[model].findByPk(id, {
                where: { ...where},
                order: order,
                include: include,
                ...query
            });
            if(!element){
                throw boom.notFound(`${model} no encontrado`);
            }
            return element;
        })
    }

    async getElementWithCondicional(model, include=null, where = {}, order = null, query = {}, attributesObject = {}){
        const attributes = Object.keys(attributesObject).length > 0 ? attributesObject : {};
        const element = await sequelize.models[model].findOne({
            where: { ...where },
            include: include,
            order: order,
            ...attributes,
            ...query
        })
        if(!element){
            throw boom.notFound(`${model} no encontrado`);
        }
        return element;
    }

    async getAllElements(model, where = null, include = null, order = null, query = {}, attributesObject = {}){
        return this.withTransaction(async (transaction) => {
            const attributes = Object.keys(attributesObject).length > 0 ? attributesObject : {};
            const elements = await sequelize.models[model].findAll({
                where: { ...where },
                order: order,
                include: include,
                ...attributes,
                ...query
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