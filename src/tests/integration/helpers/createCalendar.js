const { sequelize } = require('../../../libs/sequelize');

const createCalendar = async(token, visible=true) => {
    const res = await request
        .post(`/api/v1/calendar`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            title: 'title event',
            description: 'description event',
            startDate: '2024-07-30T14:41:00.000Z',
            endDate: '2024-07-30T16:41:00.000Z'
        });
    if(!visible){
        const calendar = await sequelize.models.Calendar.findAll();
        await calendar[calendar.length - 1].update({visible: false});
    }
    return res;
}

module.exports = createCalendar;