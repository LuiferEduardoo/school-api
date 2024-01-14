const express = require('express');
const authCombined = require('../middlewares/authCombined.handler');

const usersRouter = require('./users.router');
const authRouter = require('./auth.router');
const files = require('./files.router');
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
        authCombined('access'),
        usersRouter
    );
    router.use('/auth', authRouter);
    router.use('/file', 
        authCombined('access'),
        files
    );
    router.use('/banner', imageBanners);
    router.use('/news', newsPublication);
    router.use('/institutional-projects', institutionalProjects);
    router.use('/academic-levels', academicLevels);
    router.use('/subject', 
        authCombined('access', true),
        subject
    );
    router.use('/school-courses',
        authCombined('access', true),
        schoolCourses
    );
    router.use('/schedule', schedule);
    router.use('/admission', admissionRequest);
    router.use('/calendar', calendar);
}

module.exports = routerApi;