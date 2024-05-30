const boom = require('@hapi/boom');

const { sequelize } = require('./../libs/sequelize');
const Transactional = require('./Transactional.service');
const { SendMain } = require('./emails.service');
const { Op } = require('sequelize'); 

class AdmissionRequest extends Transactional {
    async get(req, id) {
        return this.withTransaction(async (transaction) => {
            const { search, startDate, endDate, academicLevels, gender, grade, status } = req.query;
            const include = [{ association: 'academicLevels' }, { association: 'schoolGrade' }];
            const query = this.queryParameterPagination(req.query);
            const endDateInclusive = new Date(endDate);
            endDateInclusive.setHours(23, 59, 59, 999);

            const where = startDate && endDate ? {
                createdAt: {
                    [Op.gte]: new Date(startDate),
                    [Op.lte]: endDateInclusive
                }
            } : {};
            const dataFilter= ['firstName', 'secondName', 'surname', 'secondSurname', 'numberDocument', 'email'];
            this.querySearch(dataFilter, search, where);

            if (academicLevels) {
                where['$academicLevels.name_level$'] = academicLevels;
            }

            if (gender) {
                where.gender = gender;
            }

            if (grade) {
                where['$schoolGrade.grade$'] = grade;
            }

            if (status) {
                where.status = status;
            }

            if (!id) {
                return await this.getAllElements('AdmissionRequest', where, include, null, query)
            }
            return await this.getElementWithCondicional('AdmissionRequest', include, { id: id });
        });
    }    
    async getStatus(numberDocument){
        return this.withTransaction(async (transaction) => {
            return await this.getElementWithCondicional('AdmissionRequest', null, {numberDocument: numberDocument}, null, {}, {attributes: ['status']} );
        });
    }
    async create (body){
        return this.withTransaction(async (transaction) => {
            const createSchedule = await sequelize.models.AdmissionRequest.create(body, {transaction});
            await SendMain(createSchedule.email, '¡Solicitud de admisión recibida con exito!', 'admissionRequest', {name: createSchedule.firstName, checkStatus: "http://localhost:3000/admisiones/estado" } )
            return {
                message: 'Solicitud de admisión creada con exito'
            }
        })
    }

    async update (id, body){
        return this.withTransaction(async (transaction) => {
            const getSchedule = await this.getElementById(id, 'AdmissionRequest');
            if((getSchedule.status != 'admitido' && getSchedule.status != 'No admitido') && (body.status === "admitido" || body.status === "No admitido")){
                await SendMain(getSchedule.email, '¡Te tenemos una respuesta a tu solicitud de admisión!', 'admissionDecision', {name: getSchedule.firstName, checkStatus: "http://localhost:3000/admisiones/estado" } )
            }
            await getSchedule.update(body, {transaction});
            return{
                message: 'Solicitud de admisión actualizada con exito'
            }
        });
    }

    async delete (id){
        return this.withTransaction(async (transaction) => {
            const getSchedule = await this.getElementById(id, 'AdmissionRequest');
            await getSchedule.destroy({transaction});
            return{
                message: 'Solicitud de admisión borrada con exito'
            }
        });
    }
}

module.exports = AdmissionRequest;