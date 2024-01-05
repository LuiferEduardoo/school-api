const boom = require('@hapi/boom');

const { sequelize } = require('./../libs/sequelize');
const Transactional = require('./Transactional.service');

class SchoolCourses extends Transactional {

    async createSchoolGrade(body, transaction){
        const createSchoolGrade = await sequelize.models.SchoolGrade.findCreateFind({
            where: {
                grade: body.grade,
                academicLevel: body.academicLevelId
            }, 
            defaults: {
                academicLevel: body.academicLevelId
            },
            transaction: transaction
        });
        return createSchoolGrade[0]
    }
    async get(req, id){
        return this.withTransaction(async (transaction) => {
            const include = [{association: 'schoolGrade', include: 'academic'}];
            const query = this.queryParameter(req.query);
            if(!id){
                return await this.getAllElements('SchoolCourses', {}, include, null, query)
            }
            return await this.getElementWithCondicional('SchoolCourses', include, {id: id}, null, query);
        });
    }
    async create (body){
        return this.withTransaction(async (transaction) => {
            const createSchoolGrade = await this.createSchoolGrade(body, transaction);
            const createSchoolCourses = await sequelize.models.SchoolCourses.create({...body, schoolGradeId: createSchoolGrade.id }, {transaction});
            return {
                message: 'Asignatura creada con exito'
            }
        })
    }

    async update (id, body){
        return this.withTransaction(async (transaction) => {
            if(body.grade){
                const createSchoolGrade = await this.createSchoolGrade(body, transaction);
                body.schoolGradeId = createSchoolGrade.id;
            }
            const getSchoolCourses = await this.getElementById(id, 'SchoolCourses');
            await getSchoolCourses.update(body, {transaction});
        });
    }

    async delete (id){
        return this.withTransaction(async (transaction) => {
            const getSchoolCourses = await this.getElementById(id, 'SchoolCourses');
            await getSchoolCourses.destroy({transaction})
        });
    }
}

module.exports = SchoolCourses;