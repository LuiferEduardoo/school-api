const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');

const { logErrors, errorHandler, boomErrorHandler, ormErrorHandler } = require('./middlewares/error.handler');
const handleAttachmentsOrJSON = require('./middlewares/attachementsOrJSON.handler');
const verifyPrivacyFile = require('./middlewares/verifyPrivacyFile.handler')

const app = express();
const port = process.env.PORT || 3000;

app.use(handleAttachmentsOrJSON);
const options = {
    origin: (origin, callback) => {
        callback(null, true);
        }
    }
app.use(cors(options));
require('./utils/auth');


routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);
app.use(ormErrorHandler);

app.use('/uploads', verifyPrivacyFile());

app.listen(port);