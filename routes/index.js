const express = require('express');
const passport = require('passport');

const usersRouter = require('./users.router');
const authRouter = require('./auth.router');

const routerApi = (app) => {
    const router = express.Router();
    app.use('/api/v1', router);
    router.use('/users',
        passport.authenticate('jwt', {session: false}), 
        usersRouter
    );
    router.use('/auth', authRouter);

}

module.exports = routerApi;