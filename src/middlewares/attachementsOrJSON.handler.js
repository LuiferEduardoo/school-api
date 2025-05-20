const bodyParser = require('body-parser');
// Middleware para analizar la solicitud como JSON o formularios codificados en URL
const jsonParser = bodyParser.json();
const urlEncodedParser = bodyParser.urlencoded({ extended: true });

const formidableMiddleware = require('express-formidable')({
    maxFileSize: 20 * 1024 * 1024,
    maxFiles: 5,
    keepExtensions: true,
    multiples: true,
});

const handleAttachmentsOrJSON = (req, res, next) => {
    if (req.is('json')) {
        return jsonParser(req, res, next);
    } else if (req.is('multipart')) {
        return formidableMiddleware(req, res, next);
    } else {
        return urlEncodedParser(req, res, next);
    }
};

module.exports = handleAttachmentsOrJSON;