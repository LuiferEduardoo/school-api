const express = require('express');
const passport = require('passport');

const usersRouter = require('./users.router');
const authRouter = require('./auth.router');
const fileRegistration = require('./fileRegistration.router');
const imageBanners = require('./imageBanners.router');
const newsPublication = require('./news.router');

const routerApi = (app) => {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/users',
        passport.authenticate('jwt', {session: false}), 
        usersRouter
    );
    router.use('/auth', authRouter);
    router.use('/file', 
        passport.authenticate('jwt', {session: false}), 
        fileRegistration
    );
    router.use('/banner', imageBanners);
    router.use('/news', newsPublication);
}

module.exports = routerApi;