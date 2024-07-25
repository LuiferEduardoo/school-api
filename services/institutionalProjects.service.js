const { sequelize } = require('./../libs/sequelize');
const Transactional = require('./Transactional.service');
const boom = require('@hapi/boom');
const { superAdmin } = require('../middlewares/auth.handler'); 

const ImageAssociation = require('./imageAssociation.service');
const ContentManagement = require('./contentManagement.service');
const IndividualEntity = require('./IndividualEntity.service');
const InstitutionalProjectsPublications = require('./institutionalProjectsPublications.service');

const serviceImageAssociation = new ImageAssociation();
const serviceContentManagement = new ContentManagement();
const serviceIndidualEntity = new IndividualEntity();
const serviceInstitutionalProjectsPublications = new InstitutionalProjectsPublications();

class InstitutionalProjects extends Transactional {

    async checkPermission(req, getInstitutionalProject){
        if(superAdmin.includes(req.user.role)){
        } else if(getInstitutionalProject.InstitutionalProjectsMember.some(member => member.userId === req.user.sub && member.isCoordinator)){
        } else {
            throw boom.unauthorized();
        }
    }
    isCoordinator(body){
        return body.isCoordinator ? body.isCoordinator.split(',').map(coordinator => ({
            isCoordinator: coordinator.trim().toLowerCase() === 'true'
        })) : [];    
    }
    async get(id, link, req){
        return this.withTransaction(async (transaction) => {
            const where= this.checkPermissionToGet(req);
            const { search, important, visible, member } = req.query;
            const query = this.queryParameterPagination(req.query);
            const attributes = {attributes: ['id', 'name', 'lastName']}
            const includeInstitutionalProjects = [{ association: 'members', include: [{association: 'user', ...attributes, include: [{association: 'rol'}, {association: 'image', include: [{association: 'image', include: 'file'}]}]}] }, { association: 'ImageInstitutionalProjects', include: [{ association: 'image', include: 'file' }] }];
            const dataFilter= ['title'];
            this.querySearch(dataFilter, search, where);

            this.handleElementPrivacy(req, where, 'visible', visible);

            if(member){
                where['$members.user_id$'] = member
            }

            if (important) {
                where.important = important;
            }

            if(id || link){
                const includeInstitutionalProjectsOne = [{ association: 'members', include: [{association: 'user', ...attributes, include: [{association: 'rol'}, {association: 'image', include: [{association: 'image', include: 'file'}]}]}] }, { association: 'ImageInstitutionalProjects', include: [{ association: 'image', include: 'file' }] }, ...this.includeClassification]
                const whereObtainOneElement = id ? {id: id} : {link: link}
                return await this.getElementWithCondicional('InstitutionalProjects', includeInstitutionalProjectsOne, {...whereObtainOneElement, ...where}, this.order);
            }
            return await this.getAllElements('InstitutionalProjects', where, includeInstitutionalProjects, this.order, query)
        });
    }
    async create(req, body){
        return this.withTransaction(async (transaction) => {
            const createInstitutionalProjects = await serviceContentManagement.create(body, 'InstitutionalProjects', 'institutionalProjectId', transaction);
            const members = body.members.split(',');
            const isCoordinator = this.isCoordinator(body);
            const createMembers = await serviceIndidualEntity.createIndividualEntity(members, 'userId', createInstitutionalProjects.id, 'InstitutionalProjectsMember', 'institutionalProjectsId', isCoordinator, transaction);
            const imagesInstitutionalPublications = await serviceImageAssociation.createOrAdd(req, 'ImageInstitutionalProjects', {institutionalProjectsId: createInstitutionalProjects.id}, `institutionalProjects/${createInstitutionalProjects.id}`, body.idImage, transaction, true)
            return {
                message: 'Proyecto institucional creado con exito'
            }
        });
    }

    async update(req, body, id){
        return this.withTransaction(async (transaction) => {
            const getInstitutionalProject = await this.getElementById(id, 'InstitutionalProjects', ['members']);
            await this.checkPermission(req, getInstitutionalProject);
            const idsNewMembers = body.idsNewMembers ? body.idsNewMembers.split(',') : [];
            const isCoordinator = this.isCoordinator(body);
            const updateInstitutionalProjects = await serviceContentManagement.upate(body, id, 'InstitutionalProjects', 'institutionalProjectId', transaction);
            const updateMembers = await serviceIndidualEntity.updateIndividualEntity(idsNewMembers, body.idsEliminateMembers, body.updateMembers, body.updateIsCoordinator,'userId', id, 'InstitutionalProjectsMember', 'institutionalProjectsId', isCoordinator, transaction);
            const updateimagesNewsPublications = await serviceImageAssociation.update(req, 'ImageInstitutionalProjects', {institutionalProjectsId: id}, body.idNewImage, `institutionalProjects/${id}`, body.idImageEliminate, body.eliminateImage, transaction, true);
            return {
                message: 'Proyecto institucional actualizado con exito'
            }
        });
    }

    async delete(req, body, id){
        return this.withTransaction(async (transaction) => {
            const getInstitutionalProject = await this.getElementById(id, 'InstitutionalProjects', ['members', 'InstitutionalProjectPublication']);
            await this.checkPermission(req, getInstitutionalProject);
            const getNewsPublications = await this.getElementById(id, 'InstitutionalProjects', ['ImageInstitutionalProjects']);
            const idsImagesEliminate = getNewsPublications.ImageInstitutionalProjects.map(image => (image.id));
            const deleteimagesInstitucionalProjects = await serviceImageAssociation.delete(idsImagesEliminate, 'ImageInstitutionalProjects', body.eliminateImage, req, transaction);
            const deleteInstitutionalProjectsPublications = getInstitutionalProject.InstitutionalProjectPublication.map(publication => (publication.id));
            if(deleteInstitutionalProjectsPublications[0]){
                for(const publication of deleteInstitutionalProjectsPublications){
                    await serviceInstitutionalProjectsPublications.delete(req, body, getInstitutionalProject.id, publication);
                }
            }
            const deleteMembers = await serviceIndidualEntity.deleteIndividualEntity(true, null, id, 'InstitutionalProjectsMember', 'institutionalProjectsId', transaction);
            const deleteInstitutionalProjects = await serviceContentManagement.delete(id, 'InstitutionalProjects', 'institutionalProjectId', transaction);
            return {
                message: 'Proyecto institucional eliminado con exito',
                id: id
            }
        });
    }
}

module.exports = InstitutionalProjects;