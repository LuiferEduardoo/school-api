const boom = require('@hapi/boom');

const { sequelize } = require('./../libs/sequelize');
const Transactional = require('./Transactional.service');

class SchoolCourses extends Transactional {

    async createSchoolGrade(body, academicLevelId, transaction){
        const createSchoolGrade = await sequelize.models.SchoolGrade.findCreateFind({
            where: {
                grade: body.grade,
                academicLevel: academicLevelId
            }, 
            defaults: {
                academicLevel: academicLevelId
            },
            transaction: transaction
        });
        return createSchoolGrade[0]
    }
    async get(req, academicLevelId, id){
        return this.withTransaction(async (transaction) => {
            const where = { };
            const { search } = req.query;
            const dataFilter = ['course', '$schoolGrade.grade$'];
            const include = [{association: 'schoolGrade', include: {association: 'academic', where: { id: academicLevelId }, include: ['campus', 'educationDay', 'modality']}}];
            this.querySearch(dataFilter, search, where);
            const query = this.queryParameterPagination(req.query);
            if(!id){
                return await this.getAllElements('SchoolCourses', where, include, null, query)
            }
            return await this.getElementWithCondicional('SchoolCourses', include, {id: id});
        });
    }
    async create (body, academicLevelId){
        return this.withTransaction(async (transaction) => {
            const createSchoolGrade = await this.createSchoolGrade(body, academicLevelId, transaction);
            await sequelize.models.SchoolCourses.create({...body, schoolGradeId: createSchoolGrade.id }, {transaction});
            return {
                message: 'Asignatura creada con exito'
            }
        })
    }

    async update (id, body){
        return this.withTransaction(async (transaction) => {
            const getSchoolCourses = await this.getElementById(id, 'SchoolCourses');
            if(body.grade && body.academicLevelId){
                const createSchoolGrade = await this.createSchoolGrade(body, body.academicLevelId, transaction);
                body.schoolGradeId = createSchoolGrade.id;
            }
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