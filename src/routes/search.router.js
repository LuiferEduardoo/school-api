const express = require('express');
const Search = require('./../services/Search.service');
const validatorHandler = require('../middlewares/validator.handler');
const { queryParameterSearch } = require('../schemas/search.schema');

const searchService = new Search();
const router = express.Router();

router.get('/',
    validatorHandler(queryParameterSearch, 'query'),
    async (req, res, next) => {
        try {
            const getElements = await searchService.get(req);
            res.json(getElements);
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;