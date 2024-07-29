const createSubject = async(token, subject, teacherId, id) => {
    const res = await request
        .post(`/api/v1/subject/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: subject,
            teacherId,
        });
    return res;
}

module.exports = createSubject;