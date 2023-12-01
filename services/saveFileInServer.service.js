const boom = require('@hapi/boom');

const { promisify } = require('util');
const fs = require('fs');
const renameAsync = promisify(fs.rename);
const path = require('path');
const { convertToWebP } = require('./../libs/sharp');
const { error } = require('console');

class SaveFileInServer {
    constructor(){
        
    }
    async convertImageToWebp(fileBuffer) {
        try {
            const webpBuffer = await convertToWebP(fileBuffer); // Convertir a WebP
            return webpBuffer;
        } catch (error) {
            throw boom.badImplementation('Error al convertir a WebP');
        }
    }

    getUniqueFilename(filePath) {
        let uniquePath = filePath;
        let i = 1;
    
        while (fs.existsSync(uniquePath)) {
            const { dir, name, ext } = path.parse(filePath);
            uniquePath = path.format({ dir, name: `${name}_${i}`, ext });
            i++;
        }
    
        const uniquePathParse = path.parse(uniquePath);
        return {
            uniquePath,
            fileName: path.format({ name: uniquePathParse.name, ext: uniquePathParse.ext })
        };
    }

    getDestinationPath(userId, folder) {
        const now = new Date();
        const year = now.getFullYear().toString();
        const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Agrega ceros a la izquierda si es necesario
    
        return folder ? `${folder}/${userId}/${year}/${month}` : `${userId}/${year}/${month}/`;
    }
    baseUrl(req){
        return `${req.protocol}://${req.get('host')}`;
    }

    createFolder(fullPath){
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
    }

    async uploadFileInServer(file, fileType, fullPath){
        try {
            const tempPath = file.path;
            const fileTypeFile = file.type;
            if (fileTypeFile.startsWith('image/') && fileType === 'image') {
                const fileBuffer = fs.readFileSync(tempPath);
                // Convierte la imagen a WebP
                const webpFilePath = await this.convertImageToWebp(tempPath);
                file.name = file.name.replace(/\.[^.]+$/, '.webp');
                file.type = 'image/webp';
            }
            this.createFolder(fullPath);
            const newFilePath = path.join(fullPath, file.name);

            const uniqueFilePath = this.getUniqueFilename(newFilePath);
            await renameAsync(tempPath, uniqueFilePath.uniquePath); // Utilizando promisify para fs.rename
            return uniqueFilePath;
        } catch (error) {
            throw error;
        }
    }

    async handleUploadFileInServer(req) {
        try {
            const informationFile = [];
    
            const { folder, fileType, imageCredits } = req.fields;
            const uploadedFiles = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
            const imageCreditsArray = imageCredits ? imageCredits.split(",") : [];

            let counter = 0;
            for (const file of uploadedFiles) {
                if (!file || !file.name) {
                    throw boom.badRequest('No se proporcionó ningún archivo o el nombre del archivo es inválido');
                }
                const fileTypeFile = file.type;
    
                let uploadPath = '../uploads/';
                if (fileTypeFile.startsWith('image/') && fileType === 'image') {
                    uploadPath += 'image/';
                } else if (fileTypeFile.startsWith('application/') && fileType === 'document') {
                    uploadPath += 'document/';
                }
                uploadPath += this.getDestinationPath(req.user.sub, folder)
                const fullPath = path.join(__dirname, uploadPath);
                const upload = await this.uploadFileInServer(file, fileType, fullPath);
                const url = `${this.baseUrl(req)}${uploadPath.substring(2)}/${upload.fileName}`;

                informationFile.push({  name: upload.fileName, folder: uploadPath.substring(2), url, userId: req.user.sub, fileType, imageCredits: imageCreditsArray[counter] });
                counter ++;
            }
    
            return informationFile;
        } catch (error) {
            throw error
        }
    }
    async deleteFile(pathFileToDelete){
        await fs.unlinkSync(pathFileToDelete, (err) => {
            if(err){
                throw err
                return
            }
        });
    }
    async updateFileInServer(data, req){
        try {
            const fullPath = path.join(__dirname, `../${data.path}`);
            if(fs.existsSync(fullPath) && data.fileType){
                if(data.newName || data.newFolder){
                    const exten = path.extname(data.path);
                    const originalFileName = path.basename(data.path, exten);
                    const pathNumber = data.path.match(/\/\d+\/\d+\/\d+/);

                    const pathFolder = data.newFolder ? path.join(`/uploads/${data.fileType}`, `${data.newFolder}${pathNumber}`) : data.folder;

                    const fullNewPathFolder = path.join(__dirname, `..${pathFolder}`);
                    this.createFolder(fullNewPathFolder);
                    const name = data.newName ? this.getUniqueFilename(path.join(fullNewPathFolder, `${data.newName}${exten}`)).fileName : originalFileName;

                    const fullnewPath = path.join(fullNewPathFolder, `${name}`);
                    fs.rename(fullPath, fullnewPath, (err)=> {
                        if(err){
                            throw err
                        }
                    });
                    return {
                        name: `${name}`,
                        url: `${this.baseUrl(req)}${pathFolder}/${name}`,
                        folder: pathFolder
                    };
                } else if(req.files.files){
                    const file = req.files.files;
                    const fullPathNewFile = path.join(__dirname, `../${data.folder}`);
                    const upload = await this.uploadFileInServer(file, data.fileType, fullPathNewFile)
                    await this.deleteFile(fullPath);
                    return {
                        name: file.name,
                        url: `${this.baseUrl(req)}${data.folder}/${upload.fileName}`
                    }
                }
            } 
            throw boom.notFound('Archivo no encontrado')
        } catch (error) {
            throw error;
        }
    }  
}

module.exports = SaveFileInServer;