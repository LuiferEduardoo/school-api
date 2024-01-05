const boom = require('@hapi/boom');

const { sequelize } = require('./../libs/sequelize');
const Transactional = require('./Transactional.service');

class Subject extends Transactional {

    async createSubjectName(subjectName, transaction){
        const createSubjectName = await sequelize.models.SubjectName.findCreateFind({where: {name: subjectName}, transaction});
        return createSubjectName[0]
    }
    async get(req, id){
        return this.withTransaction(async (transaction) => {
            const include = [{association: 'subjectName'}, {association: 'academicLevel'}, {association: 'teacher', attributes: ['id', 'name', 'lastName']}];
            const query = this.queryParameter(req.query);
            if(!id){
                return await this.getAllElements('Subject', {}, include, null, query)
            }
            return await this.getElementWithCondicional('Subject', include, {id: id}, null, query);
        });
    }
    async create (body){
        return this.withTransaction(async (transaction) => {
            await this.getElementWithCondicional('User', [{association: 'rol', where: { rol: 'docente' }}], {id: body.teacherId}, null, {});
            const createSubjectName = await this.createSubjectName(body.name, transaction);
            const createSubject = await sequelize.models.Subject.create({...body, subjectNameId: createSubjectName.id }, {transaction});
            return {
                message: 'Asignatura creada con exito'
            }
        })
    }

    async update (body, id){
        return this.withTransaction(async (transaction) => {
            const getSubjectName = await this.getElementById(id, 'Subject');
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