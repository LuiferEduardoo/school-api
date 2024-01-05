const Joi = require('joi');

const id = Joi.number().integer();
const string = Joi.string();
const number = Joi.number();
const hour = Joi.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/);

const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return parseInt(hours) * 60 + parseInt(minutes);
}

const getSchedule  = Joi.object({
    id: id.required()
});

const createSchedule = Joi.object({
    subjectId: id.required(),
    schoolCoursesId: id.required(),
    dayWeek: string.required(),
    startTime: hour.required(),
    endTime: hour.required().custom((value, helpers) => {
        const startTime = helpers.state.ancestors[0].startTime;

        if (startTime) {
            const start = parseTime(startTime);
            const end = parseTime(value);
            if (end <= start) {
                return helpers.error('Fecha de finalización no puede ser menor que la de inicio');
            }
        }
        return value;
    })
});

const updateSchedule  = Joi.object({
    subjectId: id,
    schoolCoursesId: id,
    dayWeekId: id,
    startTime: hour,
    endTime: hour
});


module.exports = { getSchedule, createSchedule, updateSchedule }