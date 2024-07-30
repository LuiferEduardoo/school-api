const { faker } = require('@faker-js/faker');

const createAdmission = async(randomDocumentNumber=false) => {
    const res = await request
        .post(`/api/v1/admission/request`)
        .send({
            academicLevel: 1,
            grade: 1,
            firstName: "Juan",
            secondName: "Felipe",
            surname: "Rodriguez",
            secondSurname: "Barrios",
            birthdate: "2006-08-01",
            gender: "Masculino",
            documentType: "Tarjeta de Identidad",
            numberDocument: randomDocumentNumber ? faker.number.int({ min: 1000000000, max: 9999999999 }) : 1046299389,
            phoneNumber: 3054123689,
            email: "emailstes@test.com"
        });
    return res;
}

module.exports = createAdmission;