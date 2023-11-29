const formidable = require('formidable');
const boom = require('@hapi/boom');

const { promisify } = require('util');
const fs = require('fs');
const renameAsync = promisify(fs.rename);
const path = require('path');
const { convertToWebP } = require('./../libs/sharp');

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

    async handleFileUpload(req) {
        try {
            const form = new formidable.IncomingForm();
            const informationFile = [];
    
            const parsedFields = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    if (err) {
                        reject(boom.badImplementation(err.message));
                    }
                    resolve({ fields, files });
                });
            });
    
            const { folder, fileType } = parsedFields.fields;
            const uploadedFiles = Array.isArray(parsedFields.files.files) ? parsedFields.files.files : [parsedFields.files.files];
    
            for (const file of uploadedFiles) {
                if (!file || !file.originalFilename) {
                    throw boom.badRequest('No se proporcionó ningún archivo o el nombre del archivo es inválido');
                }
                const tempPath = file.filepath;
                const fileTypeFile = file.mimetype;
    
                let uploadPath = '../uploads/';
    
                if (fileTypeFile.startsWith('image/') && fileType[0] === 'image') {
                    uploadPath += 'image/';
                    const fileBuffer = fs.readFileSync(tempPath);
                    // Convierte la imagen a WebP
                    const webpFilePath = await this.convertImageToWebp(tempPath);
                    file.originalFilename = file.originalFilename.replace(/\.[^.]+$/, '.webp');
                    file.mimetype = 'image/webp';
                } else if (fileTypeFile.startsWith('application/') && fileType[0] === 'document') {
                    uploadPath += 'document/';
                } else {
                    throw boom.badRequest('Archivo no admitido');
                }
                uploadPath += this.getDestinationPath(req.user.sub, folder[0])
    
                const fullPath = path.join(__dirname, uploadPath);
    
                if (!fs.existsSync(fullPath)) {
                    fs.mkdirSync(fullPath, { recursive: true });
                }
    
                const newFilePath = path.join(fullPath, file.originalFilename);

                const uniqueFilePath = this.getUniqueFilename(newFilePath)
    
                await renameAsync(tempPath, uniqueFilePath.uniquePath); // Utilizando promisify para fs.rename
    
                informationFile.push({ outputPath: uploadPath.substring(2), userId: req.user.sub, fileName: uniqueFilePath.fileName, fileType });
            }
    
            return informationFile;
        } catch (error) {
            throw error
        }
    }  
}

module.exports = SaveFileInServer;