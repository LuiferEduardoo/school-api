const express = require('express');
const passport = require('passport');
const { checkSuperAdmin } = require('../middlewares/auth.handler'); 

const usersRouter = require('./users.router');
const authRouter = require('./auth.router');
const fileRegistration = require('./fileRegistration.router');
const imageBanners = require('./imageBanners.router');
const newsPublication = require('./news.router');
const institutionalProjects = require('./institutionalProjects.router');
const academicLevels = require('./academicLevels.router');
const subject = require('./subject.router');
const schoolCourses = require('./schoolCourses.router');
const schedule = require('./schedule.router');
const admissionRequest = require('./admissionRequest.router');
const calendar = require('./calendar.router');

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
    router.use('/institutionalProjects', institutionalProjects);
    router.use('/academic-levels', academicLevels);
    router.use('/subject', 
        passport.authenticate('jwt', {session: false}),
        checkSuperAdmin(),
        subject
    );
    router.use('/school-courses',
        passport.authenticate('jwt', {session: false}),
        checkSuperAdmin(),
        schoolCourses
    );
    router.use('/schedule', schedule);
    router.use('/admission', admissionRequest);
    router.use('/calendar', calendar);
}

module.exports = routerApi;