const boom = require('@hapi/boom');

const { sequelize } = require('./../libs/sequelize');
const SaveFileInServer = require('./saveFileInServer.service');
const Transactional = require('./Transactional.service');
const { superAdmin } = require('../middlewares/auth.handler'); 
const path = require('path');


const serviceSaveFileInServer = new SaveFileInServer();

class FilesRegistration extends Transactional {
    async saveFilesInDatabase(req, datasFiles){
        const createdFiles = [];
        for (const dataFile of datasFiles) {
            const newFile = await sequelize.models.FilesRegistration.create(dataFile);
            createdFiles.push(newFile);
        }
        return createdFiles;
    }
    async relation(save, methodDatabase){
        let counter = 0;
        const relationFile = []
        for (const data of methodDatabase) {
            const relationInTable = await save[counter].fileType === 'image' ?
            await sequelize.models.ImageRegistration.create({ fileId: data.id, imageCredits: save[counter].imageCredits }) :
            await sequelize.models.DocumentRegistration.create({ fileId: data.id });
            relationFile.push(relationInTable);
            counter++;
        }
        return relationFile;
    }

    async fileUpload(req) {
        try {
            const saveInServer = await serviceSaveFileInServer.handleUploadFileInServer(req);
            const methodDatabase = await this.saveFilesInDatabase(req, saveInServer);
            return await this.relation(saveInServer, methodDatabase);
        } catch (error) {
            throw error;
        }
    }

    async fileOne(id){
        try {
            const fileOne = await sequelize.models.FilesRegistration.findByPk(id, {
                include: ['image', 'document']
            });
            if(!fileOne){
                throw boom.notFound('Archivo no encontrado')
            }
            let fileType; 
            if(fileOne.image[0]){
                fileType = 'image';
            } else if(fileOne.document[0]){
                fileType = 'document';
            }
            return {
                fileType,
                fileData: fileOne
            }
        } catch (error) {
            throw error
        }
    }

    async getFiles(req, id){
        const idFile = id || null;
        const where = {}
        const include = [
            {
                model: sequelize.models.ImageRegistration,
                as: 'image',
                required: false // Usamos 'false' para permitir que se devuelvan archivos sin imágenes
            },
            {
                model: sequelize.models.DocumentRegistration,
                as: 'document',
                required: false // Usamos 'false' para permitir que se devuelvan archivos sin documentos
            }
        ]; 
        if(idFile){
            where.id = idFile;
        }
        if(!superAdmin.includes(req.user.rol)){
            where.userId = req.user.sub 
        }
        return sequelize.models.FilesRegistration.findAll({
            include,
            where
        });
    }

    async fileUpdate(req, data, id){
        try {
            const fileOne = await this.fileOne(id)
            if(req.user.sub !== fileOne.fileData.userId && !superAdmin.includes(req.user.rol) ){
                throw boom.unauthorized();
            }
            const dataUpdate = {
                path: path.join(fileOne.fileData.folder, fileOne.fileData.name),
                folder: fileOne.fileData.folder,
                userId: fileOne.fileData.userId,
                fileType: fileOne.fileType,
                newName: data.newName || null,
                newFolder: data.newFolder || null,
            }
            const updateFileInServer = await serviceSaveFileInServer.updateFileInServer(dataUpdate, req);
            await fileOne.fileData.update(updateFileInServer); // Actualiza la información en la base de datos utilizando Sequelize
            return fileOne.fileData;
        } catch (error) {
            throw error
        }
    }

    async handleFileDelete (id, req){
        try {
            const fileOne = await this.fileOne(id);// Encuentra la imagen que se va a borrar
            if(req.user.sub !== fileOne.fileData.userId && !superAdmin.includes(req.user.rol) ){
                throw boom.unauthorized();
            }
            const modelFileToDelete = fileOne.fileType === "image" ? sequelize.models.ImageRegistration : sequelize.models.DocumentRegistration
            await modelFileToDelete.destroy({
                where: {
                    fileId: fileOne.fileData.id
                }
            });
            await fileOne.fileData.destroy();
            const fullPathToFileToDelete = path.join(__dirname, `..${fileOne.fileData.folder}`, fileOne.fileData.name);
            await serviceSaveFileInServer.deleteFile(fullPathToFileToDelete);
            return {
                message: 'Archivo eliminado con exito',
                id
            };
        } catch(error){
            throw error
        }
    }
}

module.exports = FilesRegistration;