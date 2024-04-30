const express = require('express');
const authCombined = require('../middlewares/authCombined.handler');
const validatorHandler = require('../middlewares/validator.handler');
const { getBanner, createBanner, updateBanner } = require('./../schemas/imageBanners.schema');
const ImageBanners = require('./../services/imageBanners.service');
const { checkFiles } = require('../schemas/files.schema');

const router = express.Router();
const serviceImageBanners = new ImageBanners();


router.get('/', 
    authCombined('access', true),
    async (req, res, next) => {
        try {
            const getAllBanners = await serviceImageBanners.getAll();
            res.json(getAllBanners)
        } catch (error) {
            next(error);
        }
    }
)
router.get('/:banners/:id?',
    validatorHandler(getBanner, 'params'),
    async (req, res, next) => {
        try {
        const { banners, id } = req.params;
        const getBanners = await serviceImageBanners.get(id, banners, req);
        res.json(getBanners);
        } catch (error) {
        next(error);
        }
    }
);

router.post('/:banners',
    authCombined('access', true),
    validatorHandler(checkFiles, 'files.files'),
    validatorHandler(createBanner, null, true),
    async (req, res, next) => {
        try {
        const body = req.body || req.fields;
        const banners = req.params.banners;
        const imageBanners = await serviceImageBanners.create(req, body, banners);
        res.status(201).json(imageBanners);
        } catch (error) {
        next(error);
        }
    }
);

router.patch('/:banners',
    authCombined('access', true),
    validatorHandler(updateBanner, null, true),
    async (req, res, next) => {
        try {
            const body = req.body || req.fields;
            const banners = req.params.banners;
            const updateBannes = await serviceImageBanners.update(req, body, banners);
            res.status(201).json(updateBannes);
        } catch (error) {
            next(error);
        }
    }
);

router.delete('/:banners',
    authCombined('access', true),
    async (req, res, next) => {
        try {
            const body = req.body || req.fields;
            const banners = req.params.banners;
            const deleteBanner = await serviceImageBanners.delete(req, body, banners);
            res.status(200).json(deleteBanner);
        } catch (error) {
        next(error);
        }
    }
);

module.exports = router;