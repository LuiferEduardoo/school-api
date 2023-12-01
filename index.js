const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');

const { logErrors, errorHandler, boomErrorHandler, ormErrorHandler } = require('./middlewares/error.handler');
const handleAttachmentsOrJSON = require('./middlewares/attachementsOrJSON.handler')

const app = express();
const port = process.env.PORT || 3000;

app.use(handleAttachmentsOrJSON);
const whitelist = ['http://localhost:8080', 'https://myapp.co'];
const options = {
    origin: (origin, callback) => {
        if (whitelist.includes(origin) || !origin) {
        callback(null, true);
        } else {
        callback(new Error('no permitido'));
        }
        }
    }
app.use(cors(options));
require('./utils/auth');


routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);
app.use(ormErrorHandler);

app.use('/uploads', express.static('uploads'));

app.listen(port);