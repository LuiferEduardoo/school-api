const { sequelize } = require('./../libs/sequelize');
const Transactional = require('./Transactional.service');
const boom = require('@hapi/boom');
const { superAdmin } = require('../middlewares/auth.handler'); 

const Publications = require('./publications.service');
const ImageAssociation = require('./imageAssociation.service');
const IndividualEntity = require('./IndividualEntity.service');

const servicePublications = new Publications();
const serviceImageAssociation = new ImageAssociation();
const serviceIndidualEntity = new IndividualEntity();

class InstitutionalProjectsPublications extends Transactional {
    async checkAuthors (authorIds, idInstitutionalProyect, mainAuthorId=null){
        const authors = [];
        const authorArray = authorIds ? authorIds.split(',').map(author => author.trim()) : [];
        const authorsToCheck = [...(mainAuthorId ? [mainAuthorId] : []), ...authorArray];
        for(const author of authorsToCheck){
            const getInMember = await sequelize.models.InstitutionalProjectsMember.findOne({
                where: {institutionalProjectsId: idInstitutionalProyect, userId: author},
                include: ['institutionalProjects'],
            })
            if(!getInMember){
                throw boom.unauthorized();
            }
            if(getInMember.institutionalProjectsId != idInstitutionalProyect){
                throw boom.unauthorized();
            }
            authors.push(getInMember.id);
        }
        return authors;
    }

    checkPermission(req, institutionalProjectPublication) {
        const verifyAuthor = institutionalProjectPublication.InstitutionalProjectsPublicationsAuthors.some(author => author.author.userId === req.user.sub); // Verificamos si la persona es autora del post
        const verifyCoordinator = institutionalProjectPublication.institutionalProjects.members.some(member => member.userId === req.user.sub && member.isCoordinator); // verificamos si la persona es coordinadora del proyecto
        switch (true) {
            case verifyAuthor:
                break;
            case verifyCoordinator:
                break;
            case superAdmin.includes(req.user.role):
                break;
            default:
                throw boom.unauthorized();
        }
    }

    async checkProjectAndPublicaton (idProject, idPublication){
        const getInstitutionalProjectsPublication = await this.getElementById(idPublication, 'InstitutionalProjectsPublications', ['ImageInstitutionalProjectPublication', 
            {
                association: 'InstitutionalProjectsPublicationsAuthors', include: 'author'
            },
            {
                association: 'institutionalProjects', include: 'members'
            }
        ]);
        if(getInstitutionalProjectsPublication.institutionalProjects.id != idProject){
            throw boom.unauthorized();
        }
        return getInstitutionalProjectsPublication;
    }

    async get(req, id, link, institutionalProjectId) {
        try {
            const where= this.checkPermissionToGet(req);
            await this.getElementWithCondicional('InstitutionalProjects', [], {id: institutionalProjectId, ...where});
            const { search, important, visible, author } = req.query;
            const whereClause = {}
            const dataFilter = ['$publication.title$']
            const query = this.queryParameterPagination(req.query);
            const attributes = {attributes: ['id', 'name', 'lastName']};
            const includeAll = [{association: 'publication', where: where, order: this.order}, {association: 'ImageInstitutionalProjectPublication', include: [{ association: 'image', include: 'file' }]}, {association: 'InstitutionalProjectsPublicationsAuthors', include:[{association: 'author', include: [{association: 'user', ...attributes}]}]}];
            this.querySearch(dataFilter, search, whereClause);

            this.handleElementPrivacy(req, where, '$publication.visible$', visible);

            if (important) {
                whereClause['$publication.important$'] = important;
            }
            
            if(author) {
                whereClause['$InstitutionalProjectsPublicationsAuthors.author.user.id$'] = author;
            }
            
            if(id || link){
                const includeOne = [{association: 'publication', where: where, order: this.order, include: this.includeClassification}, {association: 'ImageInstitutionalProjectPublication', include: [{ association: 'image', include: 'file' }]}, {association: 'InstitutionalProjectsPublicationsAuthors', include:[{association: 'author', include: [{association: 'user', ...attributes}]}]}];
                const whereObtainOneElement = id ? {id: id} : {'$publication.link$': link}
                return await this.getElementWithCondicional('InstitutionalProjectsPublications', includeOne, {...whereObtainOneElement, ...whereClause});
            }
            return await this.getAllElements('InstitutionalProjectsPublications', { InstitutionalProjectId: institutionalProjectId, ...whereClause }, includeAll, null, query);
        } catch(error){
            throw error;
        }
    }
    
    async create(req, body, id){
        return this.withTransaction(async (transaction) => {
            const authors = await this.checkAuthors(body.authors, id, req.user.sub);
            const createPublication = await servicePublications.create(body,transaction);
            const createInstitutionalProjectsPublications = await sequelize.models.InstitutionalProjectsPublications.create({publicationId: createPublication.id, InstitutionalProjectId: id}, {transaction});
            const createAuthors = await serviceIndidualEntity.createIndividualEntity(authors, 'authorId', createInstitutionalProjectsPublications.id, 'InstitutionalProjectsPublicationsAuthors', 'institutionalProjectsPublicationId', {}, transaction);
            const imagesNewPublications = await serviceImageAssociation.createOrAdd(req, 'ImageInstitutionalProjectsPublications', {institutionalProjectsPublicationsId: createInstitutionalProjectsPublications.id}, `institutionalProjects/${id}/publications/${createInstitutionalProjectsPublications.id}`, body.idImage, transaction);
            return {
                message: 'Publicación de proyecto institucional creado con exito'
            }
        });
    }
    async update (req, body, idProyect, idPublication){
        return this.withTransaction(async (transaction) => {
            const getInstitutionalProjectsPublication = await this.checkProjectAndPublicaton(idProyect, idPublication);
            this.checkPermission(req, getInstitutionalProjectsPublication);
            if(getInstitutionalProjectsPublication.institutionalProjects.members.some(member => member.userId === req.user.sub && member.isCoordinator) || superAdmin.includes(req.user.role)){
                const authors = await this.checkAuthors(body.idsNewAuthors, idProyect);
                const updateMembers = await serviceIndidualEntity.updateIndividualEntity(authors, body.idsEliminateAuthors, null, null, 'authorId', idPublication, 'InstitutionalProjectsPublicationsAuthors', 'institutionalProjectsPublicationId', {}, transaction);
            }
            const updateInstitutionalProjectsPublication = await servicePublications.upate(body, getInstitutionalProjectsPublication.publicationId, transaction);
            const updateimagesInstitutionalProjectsPublication = await serviceImageAssociation.update(req, 'ImageInstitutionalProjectsPublications', {institutionalProjectsPublicationsId: getInstitutionalProjectsPublication.id}, body.idNewImage, `institutionalProjects/${idProyect}/publications/${idPublication}`, body.idImageEliminate, body.eliminateImage, transaction);
            return {
                message: 'Publicación de proyecto institucional actualizado con exito'
            }
        });
    }
    async delete (req, body, idProyect, idPublication){
        return this.withTransaction(async (transaction) => {
            const getInstitutionalProjectsPublication = await this.checkProjectAndPublicaton(idProyect, idPublication);
            if(getInstitutionalProjectsPublication.institutionalProjects.members.some(member => member.userId === req.user.sub && member.isCoordinator) || superAdmin.includes(req.user.role)){
                const idsImagesEliminate = getInstitutionalProjectsPublication.ImageInstitutionalProjectPublication.map(image => (image.id));
                const deleteMembers = await serviceIndidualEntity.deleteIndividualEntity(true, null, idPublication, 'InstitutionalProjectsPublicationsAuthors', 'institutionalProjectsPublicationId', transaction);
                const deleteimagesInstitucionalProjects = await serviceImageAssociation.delete(idsImagesEliminate, 'ImageInstitutionalProjectsPublications', body.eliminateImage, req, transaction);
                await getInstitutionalProjectsPublication.destroy({transaction});
                const deletePublication = await servicePublications.delete(getInstitutionalProjectsPublication.publicationId, transaction);
            } else {
                throw boom.unauthorized();
            }
            return {
                message: 'Publicación de proyecto institucional borrada con exito',
                id: getInstitutionalProjectsPublication.id
            }
        })
    }
}

module.exports = InstitutionalProjectsPublications;