const Joi = require('joi');

const idsSchema = Joi.string();

const imagesUploads = (nameId) => {
    const schema = {
        [nameId]: idsSchema
    };

    return schema;
};

const imagesUpdates = (nameIdNew, nameIdEliminate) => {
    const schema = {
        [nameIdNew]: idsSchema,
        [nameIdEliminate]: idsSchema
    };

    return schema;
};

module.exports = { imagesUploads, imagesUpdates };
