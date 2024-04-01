const { sequelize } = require('./../libs/sequelize');
const boom = require('@hapi/boom');
const { superAdmin } = require('../middlewares/auth.handler');
const { Op } = require('sequelize'); 

class Transactional {
    constructor(){
        this.order = [['important', 'DESC'], ['createdAt', 'DESC']];
        this.includeClassification = [
            {association: 'categories', include:[{association: 'categories', include: 'clasification'}]},
            {association:'subcategories', include:[{association: 'subcategories', include: 'clasification'}]},
            {association:'tags', include:[{association: 'tags', include: 'clasification'}]}
        ];
    }
    queryParameterPagination(query){
        const { limit, offset } = query;
        let queryToReturn = {}
        queryToReturn.limit = limit || 10;
        queryToReturn.offset = offset || 0;
        return queryToReturn;
    }

    querySearch(filter, query, where) {
        if (query) {
            const words = query.split(' ');
            const verifyDate = (date, word) => {
                if(isNaN(word)){
                    return {[date]: { [Op.iLike]: `%${word.toLowerCase()}%` }} // Convertir términos de búsqueda a minúsculas
                }
                return {[date]: word} // Se coloca el dato directo
            }
            const searchConditions = words.map(word => ({
                [Op.or]: filter.map(element => (verifyDate(element, word)))
            }));
            where[Op.and] = searchConditions;
        }
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

    async getElementWithCondicional(model, include=null, where = {}, order = null, query = {}, attributesObject = {}, errorBoom='notFound', messageError='no encontrado'){
        const attributes = Object.keys(attributesObject).length > 0 ? attributesObject : {};
        const element = await sequelize.models[model].findOne({
            where: { ...where },
            include: include,
            order: order,
            ...attributes,
            ...query
        })
        if(!element){
            throw boom[errorBoom](`${messageError === 'no encontrado ' ? model : ''}${messageError}`);
        }
        return element;
    }

    async getAllElements(model, where = null, include = null, order = null, query = {}, attributesObject = {}, otherElements){
        return this.withTransaction(async (transaction) => {
            const attributes = Object.keys(attributesObject).length > 0 ? attributesObject : {};
            const totalCount = await sequelize.models[model].count();
            const elements = await sequelize.models[model].findAll({
                where: where,
                include: include,
                order: order,
                ...attributes,
                limit: query.limit,
                offset: query.offset,
                subQuery: false,
                ...otherElements
            });
            const totalPages = Math.ceil(totalCount / query.limit);
            return {totalPages, elements}
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