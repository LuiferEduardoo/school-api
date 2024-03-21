const boom = require('@hapi/boom');

const Transactional = require('./Transactional.service');
const FilesRegistration = require('./filesRegistration.service');
const { superAdmin } = require('../middlewares/auth.handler'); 

const serviceFilesRegistration = new FilesRegistration();

class Files extends Transactional {
    async get (req, id, type){
        return this.withTransaction(async (transaction) => {
            const model = type === 'image' ? 'ImageRegistration' : type === 'document' ? 'DocumentRegistration' : null;
            if(!model){
                throw boom.notFound(`Cannot ${req.method} ${req.originalUrl}`);
            }
            const where = superAdmin.includes(req.user.role) ? {} : {userId: req.user.sub}
            const query = this.queryParameterPagination(req.query);
            if(id){
                return await this.getElementWithCondicional(model, [{association: 'file', where: where}], {id: id});
            }
            return await this.getAllElements(model, {}, [{association: 'file', where: where}], null, query)
        });
    }
    async create (req){
        return this.withTransaction(async (transaction) => {
            await serviceFilesRegistration.fileUpload(req, transaction);
            return { message: 'File subido con exito'}
        })
    }

    async update(req, data, id) {
        return this.withTransaction(async (transaction) => {
            await serviceFilesRegistration.fileUpdate(req, data, id, transaction);
            return { message: 'File actualizado con exito' }
        });
    }

    async delete(id, req){
        return this.withTransaction(async(transaction)=> {
            return await serviceFilesRegistration.handleFileDelete(id, req, transaction);
        })
    }
}

module.exports = Files;