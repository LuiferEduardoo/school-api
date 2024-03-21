const { sequelize } = require('../libs/sequelize');
const boom = require('@hapi/boom');
const Transactional = require('./Transactional.service');

const ImageAssociation = require('./imageAssociation.service');

const serviceImageAssociation = new ImageAssociation();

class AcademicLevels extends Transactional {
    async get(req, id){
        return this.withTransaction(async (transaction) => {
            const where = this.checkPermissionToGet(req);
            const include = [{association: 'schoolGrade'}, {association: 'campus'}, {association: 'educationDay'}, {association: 'modality'}, {association: 'imageAcademicLevels', include:[{ association: 'image', include: 'file' }]}];
            const queryPagination = this.queryParameterPagination(req.query);
            const { search, visible, campusNumber, educationDay, modality} = req.query;
            const dataFilter= ['nameLevel', 'levelCode'];
            this.querySearch(dataFilter, search, where);

            if (visible) {
                where.visible = visible;
            }

            if (campusNumber) {
                where['$campus.campus_number$'] = campusNumber;
            }

            if (educationDay) {
                where['$educationDay.educationDay$'] = educationDay;
            }

            if (modality) {
                where['$modality.modality$'] = modality;
            }
            if(!id){
                return await this.getAllElements('AcademicLevels', where, include, null, queryPagination)
            }
            return await this.getElementWithCondicional('AcademicLevels', include, {id: id, ...where})
        });
    }
    async create(req, body){
        return this.withTransaction(async (transaction) => {
            const campusAcademicLevels = await this.getElementWithCondicional('CampusAcademicLevels', [], {campusNumber: body.campusNumber});
            const educationDayAcademicLevels = await sequelize.models.EducationDayAcademicLevels.findOrCreate({ where: { educationDay: body.educationDay }, transaction: transaction });
            const modalityAcademicLevels = await sequelize.models.ModalityAcademicLevels.findOrCreate({ where: { modality: body.modality }, transaction: transaction});
            const createAcademicLevels = await sequelize.models.AcademicLevels.create({
                ...body,
                campusId: campusAcademicLevels.id,
                modalityId: modalityAcademicLevels[0].id, 
                educationDayId: educationDayAcademicLevels[0].id
            }, {transaction});
            await serviceImageAssociation.createOrAdd(req, 'ImageAcademicLevels', {academicLevelsId: createAcademicLevels.id}, `academicLevels/${createAcademicLevels.id}`, body.idImage, transaction)
            return {
                message: 'Nivel academico creado con exito'
            }
        })
    }

    async update(req, body, id) {
        return this.withTransaction(async (transaction) => {
            const getAcademicLevels = await this.getElementById(id, 'AcademicLevels');
            
            const operations = [
                {
                    condition: body.campusNumber,
                    operation: async () => {
                        const campusAcademicLevels = await this.getElementWithCondicional('CampusAcademicLevels', [], { campusNumber: body.campusNumber });
                        body.campusId = campusAcademicLevels.id;
                    }
                },
                {
                    condition: body.educationDay,
                    operation: async () => {
                        const [educationDayAcademicLevels] = await sequelize.models.EducationDayAcademicLevels.findOrCreate({ where: { educationDay: body.educationDay }, transaction });
                        body.educationDayId = educationDayAcademicLevels.id;
                    }
                },
                {
                    condition: body.modality,
                    operation: async () => {
                        const [modalityAcademicLevels] = await sequelize.models.ModalityAcademicLevels.findOrCreate({ where: { modality: body.modality }, transaction });
                        body.modalityId = modalityAcademicLevels.id;
                    }
                }
            ];
            
            for (const op of operations) {
                if (op.condition) {
                    await op.operation();
                }
            }
            
            await getAcademicLevels.update(body, { transaction });
            
            await serviceImageAssociation.update(req, 'ImageAcademicLevels', { academicLevelsId: id }, body.idNewImage, `academicLevels/${id}`, body.idImageEliminate, body.eliminateImage, transaction);
            
            return {
                message: 'Nivel academico actualizado con éxito'
            };
        });
    }    

    async delete(id, body, req){
        return this.withTransaction(async (transaction) => {
            const getAcademicLevels = await this.getElementById(id, 'AcademicLevels', ['imageAcademicLevels']);
            const idsImagesEliminate = getAcademicLevels.imageAcademicLevels.map(image => (image.id));
            const deleteAcademicLevels = await serviceImageAssociation.delete(idsImagesEliminate, 'ImageAcademicLevels', body.eliminateImage, req, transaction);
            await getAcademicLevels.destroy({transaction});
            return {
                message: 'Nivel academico borrado con exito',
                id: id
            }
        });
    }
}

module.exports = AcademicLevels;