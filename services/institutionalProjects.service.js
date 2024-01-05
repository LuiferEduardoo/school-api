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
    async get(id, req){
        return this.withTransaction(async (transaction) => {
            const where = this.checkPermissionToGet(req)
            const query = this.queryParameter(req.query);
            const attributes = {attributes: ['id', 'name', 'lastName']}

            const includeInstitutionalProjects = [{ association: 'InstitutionalProjectsMember', include: [{association: 'user', ...attributes}] }, { association: 'ImageInstitutionalProjects', include: [{ association: 'image', include: 'file' }] },...this.includeClassification,
            ];
            let institutionalProjectsData;
            if(!id){
                institutionalProjectsData = await this.getAllElements('InstitutionalProjects', where, includeInstitutionalProjects, this.order, query)
            } else{
                institutionalProjectsData = [await this.getElementWithCondicional('InstitutionalProjects', includeInstitutionalProjects, {id: id, ...where}, this.order, query)];
            }
            const idList = institutionalProjectsData.map((element) => element.id);
            const publicationData = await this.getAllElements('InstitutionalProjectsPublications', { InstitutionalProjectId: idList }, [{association: 'publication', where: where, order: this.order, include: this.includeClassification}, {association: 'ImageInstitutionalProjectPublication', include: [{ association: 'image', include: 'file' }]}, {association: 'InstitutionalProjectsPublicationsAuthors', include:[{association: 'author', include: [{association: 'user', ...attributes}]}]}]);
            const publicationsByProjectId = publicationData.reduce((result, publication) => {
                const projectId = publication.InstitutionalProjectId;
                if (!result[projectId]) {
                    result[projectId] = [];
                }
                result[projectId].push(publication);
                return result;
            }, {});
            const dataToReturn = institutionalProjectsData.map((project) => {
                const projectId = project.id;
                const publications = publicationsByProjectId[projectId] || [];
                return {
                    InstitutionalProjects: project,
                    publications
                }
            })
            
            return dataToReturn
        });
    }
    async create(req, body){
        return this.withTransaction(async (transaction) => {
            const createInstitutionalProjects = await serviceContentManagement.create(body, 'InstitutionalProjects', 'institutionalProjectId', transaction);
            const members = body.members.split(',');
            const isCoordinator = this.isCoordinator(body);
            const createMembers = await serviceIndidualEntity.createIndividualEntity(members, 'userId', createInstitutionalProjects.id, 'InstitutionalProjectsMember', 'institutionalProjectsId', isCoordinator, transaction);
            const imagesNewsPublications = await serviceImageAssociation.createOrAdd(req, 'ImageInstitutionalProjects', {institutionalProjectsId: createInstitutionalProjects.id}, `institutionalProjects`, body.idImage, transaction)
            return {
                message: 'Proyecto institucional creado con exito'
            }
        });
    }

    async update(req, body, id){
        return this.withTransaction(async (transaction) => {
            const getInstitutionalProject = await this.getElementById(id, 'InstitutionalProjects', ['InstitutionalProjectsMember']);
            await this.checkPermission(req, getInstitutionalProject);
            const idsNewMembers = body.idsNewMembers ? body.idsNewMembers.split(',') : [];
            const isCoordinator = this.isCoordinator(body);
            const updateInstitutionalProjects = await serviceContentManagement.upate(body, id, 'InstitutionalProjects', 'institutionalProjectId', transaction);
            const updateMembers = await serviceIndidualEntity.updateIndividualEntity(idsNewMembers, body.idsEliminateMembers, 'userId', id, 'InstitutionalProjectsMember', 'institutionalProjectsId', isCoordinator, transaction);
            const updateimagesNewsPublications = await serviceImageAssociation.update(req, 'ImageInstitutionalProjects', {institutionalProjectsId: id}, body.idNewImage, `institutionalProjects`, body.idImageEliminate, body.eliminateImage, transaction);
            return {
                message: 'Proyecto institucional actualizado con exito'
            }
        });
    }

    async delete(req, body, id){
        return this.withTransaction(async (transaction) => {
            const getInstitutionalProject = await this.getElementById(id, 'InstitutionalProjects', ['InstitutionalProjectsMember', 'InstitutionalProjectsPublications']);
            await this.checkPermission(req, getInstitutionalProject);
            const getNewsPublications = await this.getElementById(id, 'InstitutionalProjects', ['ImageInstitutionalProjects']);
            const idsImagesEliminate = getNewsPublications.ImageInstitutionalProjects.map(image => (image.id));
            const deleteimagesInstitucionalProjects = await serviceImageAssociation.delete(idsImagesEliminate, 'ImageInstitutionalProjects', body.elimianteImages, req, transaction);
            const deleteInstitutionalProjectsPublications = getInstitutionalProject.InstitutionalProjectsPublications.map(publication => (publication.id));
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