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
            const { grade, course } = req.params;
            const whereCourse = course ? { course: course } : {};
            const include = [{association: 'dayWeek'}, {association: 'schoolCourses', where: whereCourse , include: [{association: 'schoolGrade', where: { grade: grade }}]}, {association: 'subject', include: [ {association:'subjectName'}, {association: 'teacher', attributes: ['id', 'name', 'lastName']}]}];
            const query = this.queryParameter(req.query);
            return await this.getAllElements('Schedule', {}, include, null, query)
        })
    }
    async create (body){
        return this.withTransaction(async (transaction) => {
            const createSchuleDay = await this.createSchuleDay(body.dayWeek, transaction);
            const createSchedule = await sequelize.models.Schedule.create({...body, dayWeekId: createSchuleDay.id }, {transaction});
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
            await getSchedule.update(body, {transaction});
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