const express = require('express');
const FilesRegistration = require('../services/filesRegistration.service');
const validatorHandler = require('../middlewares/validator.handler');
const { getFilesRegistration, createFilesRegistrationDate, createFile, updateFilesRegistration } = require('./../schemas/filesRegistration.schema');

const router = express.Router();

const file = new FilesRegistration();


router.get('/:id?',
    async (req, res, next) => {
        try {
            const id = req.params.id;
            const getFiles = await file.getFiles(req, id);
            res.status(201).json(getFiles);
        } catch (error) {
            next(error);
        }
    }
);

router.post('/upload',
    validatorHandler(createFilesRegistrationDate, 'fields'),
    async (req, res, next) => {
        try {
            const uploadFile = await file.fileUpload(req);
            res.status(201).json(uploadFile);
        } catch (error) {
            next(error);
        }
    }
);

router.patch('/update/:id',
    validatorHandler(getFilesRegistration, 'params'),
    validatorHandler(updateFilesRegistration, null, true),
    async (req, res, next) => {
        try {
            const id = req.params.id;
            const data = req.body || req.fields; 
            const fileUpdate = await file.fileUpdate(req, data, id);
            res.status(201).json(fileUpdate);
        } catch (error) {
            next(error);
        }
    }
);

router.delete('/:id',
    validatorHandler(getFilesRegistration, 'params'),
    async (req, res, next) => {
        try {
            const id = req.params.id;
            const deleteFile = await file.handleFileDelete(id, req);
            res.status(201).json(deleteFile);
        } catch (error) {
            next(error);
        }
    }
);


module.exports = router;