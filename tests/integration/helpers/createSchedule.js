const createSchedule = async(token, id, dayWeek) => {
    const res = await request
        .post(`/api/v1/schedule/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            subjectId: 1,
            dayWeek,
            startTime: '10:00',
            endTime: "11:00"
        });
    return res;
}

module.exports = createSchedule;