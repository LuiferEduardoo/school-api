const createSchoolCourse = async(token, id, grade, course) => {
    const res = await request
        .post(`/api/v1/school-courses/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            grade,
            course,
        });
    return res;
}

module.exports = createSchoolCourse;