const sharp = require('sharp');
const { PDFDocument, rgb } = require('pdf-lib');

const generateFiles = async (fileType) => {
    if(fileType === "image"){
        return await sharp({
            create: {
                width: 200,
                height: 200,
                channels: 4,
                background: { r: 255, g: 0, b: 0, alpha: 0.5 }
            }
        })
        .png()
        .toBuffer();
    } else if(fileType === "document"){
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]);
        const { width, height } = page.getSize();
        const fontSize = 30;

        page.drawText('Este es un PDF generado en buffer', {
            x: 50,
            y: height - 4 * fontSize,
            size: fontSize,
            color: rgb(0, 0, 0),
        });

        const pdfBytes = await pdfDoc.save();
        return Buffer.from(pdfBytes);
    }
}

module.exports = generateFiles