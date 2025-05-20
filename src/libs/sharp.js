const sharp = require('sharp');

async function convertToWebP(buffer) {
    try {
        const webpBuffer = await sharp(buffer)
            .toFormat('webp')
            .toBuffer();
        return webpBuffer;
    } catch (error) {
        throw new Error('Error al convertir a WebP');
    }
}

module.exports = { convertToWebP };