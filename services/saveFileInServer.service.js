const boom = require('@hapi/boom');

const { promisify } = require('util');
const fs = require('fs');
const renameAsync = promisify(fs.rename);
const path = require('path');
const { convertToWebP } = require('./../libs/sharp');

class SaveFileInServer {
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
            const convertImageToWebp = async (fileBuffer) => {
                try {
                    const webpBuffer = await convertToWebP(fileBuffer); // Convertir a WebP
                    return webpBuffer;
                } catch (error) {
                    throw boom.badImplementation('Error al convertir a WebP');
                }
            }
            const tempPath = file.path;
            const fileTypeFile = file.type;
            if (fileTypeFile.startsWith('image/') && fileType === 'image') {
                const fileBuffer = fs.readFileSync(tempPath);
                const webpFilePath = await convertImageToWebp(tempPath); // Convierte la imagen a WebP
                file.name = file.name.replace(/\.[^.]+$/, '.webp'); // remplazamos la extensión por .webp
                file.type = 'image/webp'; // Y el tipo de archivo
            }
            this.createFolder(fullPath); // creamos el folder en el caso que no exista
            const filePath = path.join(fullPath, file.name);

            const uniqueFilePath = this.getUniqueFilename(filePath); // creamos un unico path para los archivos
            await fs.copyFileSync(tempPath, uniqueFilePath.uniquePath); // Utilizando promisify para fs.rename
            await fs.unlinkSync(tempPath);
            return uniqueFilePath;
        } catch (error) {
            throw error;
        }
    }

    async handleUploadFileInServer(req) {
        const getDestinationPath = (userId, folder) => {
            const now = new Date();
            const year = now.getFullYear().toString();
            const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Agrega ceros a la izquierda si es necesario
        
            return folder ? `${folder}/${userId}/${year}/${month}` : `${userId}/${year}/${month}/`;
        }
        try {
            const informationFile = [];
    
            const { folder, fileType, imageCredits, isPublic } = req.fields;
            const uploadedFiles = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
            const imageCreditsArray = imageCredits ? imageCredits.split(",") : [];
            const isPublicArray = Array.isArray(isPublic) ? isPublic : isPublic.split(',').map((value) => {
                return value === 'true';
            })

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
                uploadPath += getDestinationPath(req.user.sub, folder) // se asigna la ruta con el id del usuario el año y el mes
                const fullPath = path.join(__dirname, uploadPath);
                const upload = await this.uploadFileInServer(file, fileType, fullPath);
                const url = `${this.baseUrl(req)}${uploadPath.substring(2)}/${upload.fileName}`;

                informationFile.push({  name: upload.fileName, folder: uploadPath.substring(2), url, userId: req.user.sub, fileType, imageCredits: imageCreditsArray[counter], isPublic: isPublicArray[counter] });
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
            const files = req.files ? req.files.files : null
            let response = {
                isPublic: data.isPublic
            };
            if(!fs.existsSync(fullPath) && !data.fileType){
                throw boom.notFound('Archivo no encontrado')
            } 
            if(data.newName || data.newFolder){
                const extenFile = path.extname(data.path);
                const originalFileName = path.basename(data.path, extenFile);
                const pathNumber = data.path.match(/\/\d+\/\d+\/\d+/);

                const pathFolder = data.newFolder ? path.join(`/uploads/${data.fileType}`, `${data.newFolder}${pathNumber}`) : data.folder;

                const fullNewPathFolder = path.join(__dirname, `..${pathFolder}`);
                this.createFolder(fullNewPathFolder); // creamos los folder si no existen
                const name = data.newName ? this.getUniqueFilename(path.join(fullNewPathFolder, `${data.newName}${extenFile}`)).fileName : originalFileName; // obtenemos un nombre unico para el archivo si se cambio el nombre

                const fullnewPath = path.join(fullNewPathFolder, `${name}`);
                
                // se renombra el archivo
                fs.rename(fullPath, fullnewPath, (err)=> {
                    if(err){
                        throw err
                    }
                });
                // asignamos valores a el objeto de respuesta
                response.name = name;
                response.url = `${this.baseUrl(req)}${pathFolder}/${name}`
                response.folder = pathFolder
            } else if(files){
                const file = req.files.files;
                const fullPathNewFile = path.join(__dirname, `../${data.folder}`);
                const upload = await this.uploadFileInServer(file, data.fileType, fullPathNewFile)
                await this.deleteFile(fullPath);
                response.name = file.name
                response.url =  `${this.baseUrl(req)}${data.folder}/${upload.fileName}`
            }
            return response;
        } catch (error) {
            throw error;
        }
    }  
}

module.exports = SaveFileInServer;