const boom = require('@hapi/boom');

const { sequelize } = require('./../libs/sequelize');
const Transactional = require('./Transactional.service');

class Subject extends Transactional {

    async createSubjectName(subjectName, transaction){
        const createSubjectName = await sequelize.models.SubjectName.findCreateFind({where: {name: subjectName}, transaction});
        return createSubjectName[0]
    }
    async get(req, id, academicLevelId){
        return this.withTransaction(async (transaction) => {
            const where = { academicLevelId: academicLevelId };
            const { search, teacher } = req.query;
            const include = [{association: 'subjectName'}, {association: 'academicLevel'}, {association: 'teacher', attributes: ['id', 'name', 'lastName']}];
            const query = this.queryParameterPagination(req.query);
            const dataFilter= ['$subjectName.name$', '$teacher.name$', '$teacher.last_name$', '$teacher.username$', '$teacher.email$'];
            this.querySearch(dataFilter, search, where);

            if (teacher) {
                where['$teacher.id$'] = teacher;
            }
            
            if(!id){
                return await this.getAllElements('Subject', where, include, null, query)
            }
            return await this.getElementWithCondicional('Subject', include, {id: id, ...where});
        });
    }
    async create (body, academicLevelId){
        return this.withTransaction(async (transaction) => {
            await this.getElementWithCondicional('User', [{association: 'rol', where: { rol: 'docente' }}], {id: body.teacherId}, null, {});
            const createSubjectName = await this.createSubjectName(body.name, transaction);
            await sequelize.models.Subject.create({...body, subjectNameId: createSubjectName.id, academicLevelId: academicLevelId }, {transaction});
            return {
                message: 'Asignatura creada con exito'
            }
        })
    }

    async update (body, id){
        return this.withTransaction(async (transaction) => {
            const getSubjectName = await this.getElementById(id, 'Subject');
            if(body.teacherId){
                await this.getElementWithCondicional('User', [{association: 'rol', where: { rol: 'docente' }}], {id: body.teacherId}, null, {});
            }
            if(body.name){
                const createSubjectName = await this.createSubjectName(body.name, transaction);
                body.subjectNameId = createSubjectName.id;
            }
            await getSubjectName.update(body, {transaction});
            return {
                message: 'Asignatura actualizada con exito'
            }
        });
    }

    async delete (id){
        return this.withTransaction(async (transaction) => {
            const getSubjectName = await this.getElementById(id, 'Subject');
            await getSubjectName.destroy({transaction})
            return {
                message: 'Asignatura borrada con exito'
            }
        });
    }
}

module.exports = Subject;