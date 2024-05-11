const boom = require('@hapi/boom');

const { sequelize } = require('./../libs/sequelize');
const SaveFileInServer = require('./saveFileInServer.service');
const Transactional = require('./Transactional.service');
const { superAdmin } = require('../middlewares/auth.handler'); 
const path = require('path');


const serviceSaveFileInServer = new SaveFileInServer();

class FilesRegistration extends Transactional{
    async fileUpload(req, transaction) {
        const saveFilesInDatabase = async (req, datasFiles, transaction) => {
            const createdFiles = [];
            for (const dataFile of datasFiles) {
                const newFile = await sequelize.models.FilesRegistration.create(dataFile, {transaction});
                createdFiles.push(newFile);
            }
            return createdFiles;
        }
        const relation = async (save, methodDatabase, transaction) =>{
            let counter = 0;
            const relationFile = []
            for (const data of methodDatabase) {
                const relationInTable = await save[counter].fileTypeFile === 'image' ?
                await sequelize.models.ImageRegistration.create({ fileId: data.id, imageCredits: save[counter].imageCredits }, {transaction}) :
                await sequelize.models.DocumentRegistration.create({ fileId: data.id }, {transaction});
                relationFile.push(relationInTable);
                counter++;
            }
            return relationFile;
        }
        try {
            const saveInServer = await serviceSaveFileInServer.handleUploadFileInServer(req);
            const methodDatabase = await saveFilesInDatabase(req, saveInServer, transaction);
            return await relation(saveInServer, methodDatabase, transaction);
        } catch (error) {
            throw error;
        }
    }

    async get(id){
        return this.withTransaction(async (transaction) => {
            const include = ['image', 'document']
            if(id){
                return await this.getElementById(id, 'FilesRegistration', include)
            }
            return await this.getAllElements('FilesRegistration', {}, include)
        })
    }

    async fileUpdate(req, data, id, transaction){
        try {
            const file = await this.get(id)
            if(req.user.sub !== file.userId && !superAdmin.includes(req.user.role) ){
                throw boom.unauthorized();
            }
            const fileType = file.image[0] ? 'image' : file.document[0] && 'document'
            const dataUpdate = {
                path: path.join(file.folder, file.name),
                folder: file.folder,
                userId: file.userId,
                fileType: fileType,
                newName: data.newName || null,
                newFolder: data.newFolder || null,
                isPublic: data.isPublic
            }
            const updateFileInServer = await serviceSaveFileInServer.updateFileInServer(dataUpdate, req);
            await file.update(updateFileInServer, {transaction}); // Actualiza la información en la base de datos utilizando Sequelize
            return file;
        } catch (error) {
            throw error
        }
    }

    async handleFileDelete (id, req, transaction){
        try {
            const file = await this.get(id);// Encuentra la imagen que se va a borrar
            const fileType = file.image[0] ? 'image' : file.document[0] ? 'document' : null
            if(req.user.sub !== file.userId && !superAdmin.includes(req.user.role) ){
                throw boom.unauthorized();
            }
            const modelFileToDelete = fileType === "image" ? sequelize.models.ImageRegistration : sequelize.models.DocumentRegistration
            await modelFileToDelete.destroy({
                where: {
                    fileId: file.id
                }
            });
            await file.destroy({transaction});
            const fullPathToFileToDelete = path.join(__dirname, `..${file.folder}`, file.name);
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