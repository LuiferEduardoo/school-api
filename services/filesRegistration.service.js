const boom = require('@hapi/boom');

const { sequelize } = require('./../libs/sequelize');
const SaveFileInServer = require('./saveFileInServer.service');


const serviceSaveFileInServer = new SaveFileInServer();

class FilesRegistration {
    constructor(){
    }

    structureDatabase(req, outputPath, userId, fileType){
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        const fileName = fileType === 'imagen' ? `${req.file.filename}.webp` : `${req.file.filename}`; // Nombre del archivo en caso que sea una imagen o un documento
        const filePath = outputPath; // Ruta donde se guardó el archivo
        const fileUrl = `${baseUrl}/${filePath}`; // Construir la URL completa para el archivo
        return {
            name: fileName, 
            folder: filePath,
            url: fileUrl,
            userId: userId,
        }
    }

    async saveFileInDatabase(req, outputPath, userId, fileType){
        const dataFile = this.structureDatabase(req, outputPath, userId, fileType);
        // Guardar la información en la base de datos utilizando Sequelize
        const newFile = await sequelize.models.FilesRegistration.create(dataFile);
        return newFile;
    }
    async updateFileInDatabase(req, outputPath, fileToUpdate){
        const dataFile = this.structureDatabase(req, outputPath);
        // Actualiza la información en la base de datos utilizando Sequelize
        const updateFile = fileToUpdate = dataFile;
        await fileToUpdate.save();
        return updateFile;
    }
    async relation(fileType, methodDatabase){
        const imageCredits = methodDatabase.imageCredits != null ? methodDatabase.imageCredits : null
        const relationInTable = await fileType === 'image' ?
        sequelize.models.ImageRegistration.create({ fileId: methodDatabase.id, imageCredits: imageCredits }) :
        sequelize.models.DocumentRegistration.create({ fileId: methodDatabase.id });
        return relationInTable
    }

    async fileUpload(req, typeUpload, fileModel = null) {
        try {
            const save = await serviceSaveFileInServer.handleFileUpload(req);
            return save;
            // if (typeUpload === 'upload') {
            //     methodDatabase = await this.saveFileInDatabase(req, outputPath, userId, fileType);
            //     return await this.relation(fileType, methodDatabase);
            // } else if (typeUpload === 'update') {
            //     const fileToUpdate = await sequelize.models[fileModel].findByPk(req.body.id);
            //     methodDatabase = this.updateFileInDatabase(req, outputPath, fileToUpdate);
            // }
        } catch (error) {
            throw error;
        }
    }

    async handleFileDelete (data){
        fs.unlinkSync(fileToDelete.folder + '/' + fileToDelete.name);
        const imageToDelete = await sequelize.models.FilesRegistration.findByPk(data.id); // Encuentra la imagen que se va a borrar
        await sequelize.models.ImageRegistration.destroy({
            where: {
                fileId: imageToDelete.id
            }
        });

        await imageToDelete.destroy();
        await this.handleFileDelete(imageToDelete);
    }
}

module.exports = FilesRegistration;