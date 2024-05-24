const boom = require('@hapi/boom');

const { sequelize } = require('./../libs/sequelize');
const Transactional = require('./Transactional.service');

class Schedule extends Transactional {

    async createSchuleDay(dayweek, transaction){
        const createSchuleDay = await sequelize.models.ScheduleDay.findCreateFind({where: {dayweek: dayweek}, transaction});
        return createSchuleDay[0]
    }
    async get (req){
        return this.withTransaction(async (transaction) => {
            const { id, schoolCoursesId } = req.params;
            const include = [{association: 'dayWeek'}, {association: 'schoolCourses', where: { id: schoolCoursesId }, include: [{association: 'schoolGrade'}]}, {association: 'subject', include: [ {association:'subjectName'}, {association: 'teacher', attributes: ['id', 'name', 'lastName'], include: [{association: 'image', include: [{association: 'image', include: 'file'}]}]}]}];
            if(id){
                return await this.getElementById(id, 'Schedule', include);
            }
            return await this.getAllElementsWithoutQuery('Schedule', include);
        })
    }
    async create (body, schoolCoursesId){
        return this.withTransaction(async (transaction) => {
            const createSchuleDay = await this.createSchuleDay(body.dayWeek, transaction);
            await sequelize.models.Schedule.create({...body, dayWeekId: createSchuleDay.id, schoolCoursesId: schoolCoursesId }, {transaction});
            return {
                message: 'Horario creado con exito'
            }
        })
    }

    async update (id, body){
        const parseTime = (timeString) => {
            const [hours, minutes] = timeString.split(':');
            return parseInt(hours) * 60 + parseInt(minutes);
        }
        return this.withTransaction(async (transaction) => {
            const getSchedule = await this.getElementById(id, 'Schedule');
            const startTime = body.startTime || getSchedule.startTime;
            const endTime = body.endTime || getSchedule.endTime;
            if(parseTime(endTime) <= parseTime(startTime))
                throw boom.badData('Las horas de finalización no deben ser inferior a las de inicio y viceversa ');
            const createSchuleDay = await this.createSchuleDay(body.dayWeek, transaction);
            await getSchedule.update({ ...body, dayWeekId: createSchuleDay.id }, {transaction});
            return {
                message: 'Horario actualizado con exito'
            }
        });
    }

    async delete (id){
        return this.withTransaction(async (transaction) => {
            const getSchedule = await this.getElementById(id, 'Schedule');
            await getSchedule.destroy({transaction})
        });
    }
}

module.exports = Schedule;