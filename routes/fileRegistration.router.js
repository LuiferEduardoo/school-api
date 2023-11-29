const express = require('express');
const FilesRegistration = require('../services/filesRegistration.service');
const validatorHandler = require('../middlewares/validator.handler');
const { getFilesRegistration, createFilesRegistrationDate, createFile, updateFilesRegistration } = require('./../schemas/filesRegistration.schema');
const formidable = require('formidable');


const router = express.Router();

const file = new FilesRegistration();

router.post('/upload',
    // validatorHandler(createFilesRegistrationDate, 'body'),
    async (req, res, next) => {
        try {
            const uploadFile = await file.fileUpload(req, 'upload');
            res.json(uploadFile);
        } catch (error) {
            next(error);
        }
    }
);


module.exports = router;