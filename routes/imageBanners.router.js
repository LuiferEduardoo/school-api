const express = require('express');
const passport = require('passport');
const validatorHandler = require('../middlewares/validator.handler');
const { checkSuperAdmin } = require('../middlewares/auth.handler'); 
const { getBanner, createBanner, updateBanner } = require('./../schemas/imageBanners.schema');
const ImageBanners = require('./../services/imageBanners.service');

const router = express.Router();
const serviceImageBanners = new ImageBanners();


router.get('/:banners/:id?',
    validatorHandler(getBanner, 'params'),
    async (req, res, next) => {
        try {
        const { banners, id } = req.params;
        const getBanners = await serviceImageBanners.getBanners(id, banners);
        res.json(getBanners);
        } catch (error) {
        next(error);
        }
    }
);

router.post('/:banners',
    passport.authenticate('jwt', {session: false}), 
    checkSuperAdmin(),
    validatorHandler(createBanner, 'fields'),
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
    passport.authenticate('jwt', {session: false}), 
    checkSuperAdmin(),
    validatorHandler(updateBanner, 'fields'),
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
    passport.authenticate('jwt', {session: false}), 
    checkSuperAdmin(),
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