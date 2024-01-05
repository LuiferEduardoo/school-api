const boom = require('@hapi/boom');

const { sequelize } = require('./../libs/sequelize');
const Transactional = require('./Transactional.service');

class Calendar extends Transactional {
    async get(req, id){
        return this.withTransaction(async (transaction) => {
            const where = this.checkPermissionToGet(req);
            const query = this.queryParameter(req.query);
            if(!id){
                return await this.getAllElements('Calendar', where, null, null, query)
            }
            return await this.getElementWithCondicional('Calendar', null, {id: id, ...where}, null, query);
        });
    }
    async create (body){
        return this.withTransaction(async (transaction) => {
            const createSchedule = await sequelize.models.Calendar.create(body, {transaction});
            return {
                message: 'Calendario creado con exito'
            }
        })
    }

    async update (id, body){
        return this.withTransaction(async (transaction) => {
            const getSchedule = await this.getElementById(id, 'Calendar');
            const startDate = body.startDate || getSchedule.startDate;
            const endDate = body.endDate || getSchedule.endDate;
            if(new Date(endDate) < new Date(startDate))
                throw boom.badData('Las fechas de finalización no deben ser inferior a las de inicio y viceversa');
            await getSchedule.update(body, {transaction});
            return{
                message: 'Calendario actualizado con exito'
            }
        });
    }

    async delete (id){
        return this.withTransaction(async (transaction) => {
            const getSchedule = await this.getElementById(id, 'Calendar');
            await getSchedule.destroy({transaction});
            return{
                message: 'Calendario borrado con exito'
            }
        });
    }
}

module.exports = Calendar;