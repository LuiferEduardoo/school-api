const boom = require('@hapi/boom');

function validatorHandler(schema, property, isBody=false) {
    return (req, res, next) => {
        let typeProperty; 
        if(isBody && req.body){
            typeProperty = 'body';
        } else if(isBody && req.fields){
            typeProperty = 'fields';
        } else {
            typeProperty = property;
        }
        const data = req[typeProperty];
        const { error } = schema.validate(data, { abortEarly: false });
        if (error) {
        next(boom.badRequest(error));
        }
        next();
    }
}

module.exports = validatorHandler;