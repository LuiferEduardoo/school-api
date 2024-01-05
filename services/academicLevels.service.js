const { sequelize } = require('../libs/sequelize');
const boom = require('@hapi/boom');
const Transactional = require('./Transactional.service');

const ImageAssociation = require('./imageAssociation.service');

const serviceImageAssociation = new ImageAssociation();

class AcademicLevels extends Transactional {
    async get(req, id){
        return this.withTransaction(async (transaction) => {
            const where = this.checkPermissionToGet(req)
            const query = this.queryParameter(req.query);
            const include = [{association: 'imageAcademicLevels', include:[{ association: 'image', include: 'file' }]}, {association: 'schoolGrade'}];
            if(!id){
                return await this.getAllElements('AcademicLevels', where, include, null, query)
            }
            return await this.getElementWithCondicional('AcademicLevels', include, {id: id, ...where}, null, query)
        });
    }
    async create(req, body){
        return this.withTransaction(async (transaction) => {
            const createAcademicLevels = await sequelize.models.AcademicLevels.create(body, {transaction});
            const imagesAcademicLevels = await serviceImageAssociation.createOrAdd(req, 'ImageAcademicLevels', {academicLevelsId: createAcademicLevels.id}, `academicLevels`, body.idImage, transaction)
            return {
                message: 'Nivel academico creado con exito'
            }
        })
    }

    async update(req, body, id){
        return this.withTransaction(async (transaction) => {
            const getAcademicLevels = await this.getElementById(id, 'AcademicLevels');
            const updateAcademicLevels = await serviceImageAssociation.update(req, 'ImageAcademicLevels', {academicLevelsId: id}, body.idNewImage, `academicLevels`, body.idImageEliminate, body.eliminateImage, transaction);
            return {
                message: 'Nivel academico con exito'
            }
        })
    }

    async delete(id, body, req){
        return this.withTransaction(async (transaction) => {
            const getAcademicLevels = await this.getElementById(id, 'AcademicLevels', ['imageAcademicLevels']);
            const idsImagesEliminate = getAcademicLevels.imageAcademicLevels.map(image => (image.id));
            const deleteAcademicLevels = await serviceImageAssociation.delete(idsImagesEliminate, 'ImageAcademicLevels', body.elimianteImages, req, transaction);
            await getAcademicLevels.destroy({transaction});
            return {
                message: 'Nivel academico borrado con exito',
                id: id
            }
        });
    }
}

module.exports = AcademicLevels;