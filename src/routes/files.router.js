const express = require('express');
const Files = require('../services/files.service');
const validatorHandler = require('../middlewares/validator.handler');
const { checkFiles, getFileNoRequired, getFiles, createFiles, updateFiles } = require('../schemas/files.schema');

const router = express.Router();

const file = new Files();


router.get('/:type/:id?',
    validatorHandler(getFileNoRequired, 'params.id'),
    async (req, res, next) => {
        try {
            const { type, id } = req.params;
            const getFiles = await file.get(req, id, type);
            res.json(getFiles);
        } catch (error) {
            next(error);
        }
    }
);

router.post('/upload',
    validatorHandler(createFiles, 'fields'),
    validatorHandler(checkFiles, 'files.files'),
    async (req, res, next) => {
        try {
            const uploadFile = await file.create(req);
            res.status(201).json(uploadFile);
        } catch (error) {
            next(error);
        }
    }
);

router.patch('/update/:id',
    validatorHandler(getFiles, 'params'),
    validatorHandler(updateFiles, null, true),
    async (req, res, next) => {
        try {
            const id = req.params.id;
            const data = req.body || req.fields; 
            const fileUpdate = await file.update(req, data, id);
            res.json(fileUpdate);
        } catch (error) {
            next(error);
        }
    }
);

router.delete('/:id',
    validatorHandler(getFiles, 'params'),
    async (req, res, next) => {
        try {
            const id = req.params.id;
            const deleteFile = await file.delete(id, req);
            res.json(deleteFile);
        } catch (error) {
            next(error);
        }
    }
);


module.exports = router;