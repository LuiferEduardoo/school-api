const express = require('express');

const usersRouter = require('./users.router');
const blogRouter = require('./orders.router');
const schedulesRouter = require('./products.router');
const calendarsRouter = require('./categories.router');

const routerApi = (app) => {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/users', usersRouter);
    router.use('/blog', blogRouter);
    router.use('/schedules', schedulesRouter);
    router.use('/calendar', calendarsRouter);
}

module.exports = routerApi;