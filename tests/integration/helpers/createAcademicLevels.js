const { sequelize } = require('../../../libs/sequelize');
const { uploadFilesForUser } = require('./uploadFile');
const fileGenerator = require('./fileGenerator');
const { faker } = require('@faker-js/faker');

const createCampus = async() => {
    const defaultCampuses = [
        { campus: 'Institución Educativa María Inmaculada', campusNumber: 1 },
        { campus: 'Institución Educativa María Auxiliadora', campusNumber: 2 },
    ];

    for (let index = 0; index < defaultCampuses.length; index++) {
        await sequelize.models.CampusAcademicLevels.create({
            campus: defaultCampuses[index].campus,
            campusNumber: defaultCampuses[index].campusNumber
        });
    }
}

const createAcademicLevels = async(token, typeImage, visible=true) => {
    let res;

    const nameLevel = 'example name level';
    const description = 'example description';
    const levelCode = faker.number.int({ min: 1000, max: 9999 });
    const campusNumber = 1;
    const modality = 'Presencial';
    const educationalObjectives = 'example educational objectives';
    const admissionRequirements = 'example admission requeriments';
    const educationDay = 'Mañana';

    if(typeImage === 'idImage'){
        await uploadFilesForUser(token, true, 'image');
        const imagesToAdd = await sequelize.models.ImageRegistration.findAll();
        const ids = imagesToAdd.map(image => image.id);
        const idImage = String(ids[ids.length - 1]);
        res = await request
            .post(`/api/v1/academic-levels`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                nameLevel,
                description,
                levelCode,
                campusNumber,
                modality,
                educationalObjectives,
                admissionRequirements,
                educationDay,
                idImage
            })
    } else {
        const fileBuffer = await fileGenerator('image');
        res = await request
            .post(`/api/v1/academic-levels`)
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'multipart/form-data')
            .field('nameLevel', nameLevel)
            .field('description', description)
            .field('levelCode', levelCode)
            .field('campusNumber', campusNumber)
            .field('modality', modality)
            .field('educationalObjectives', educationalObjectives)
            .field('admissionRequirements', admissionRequirements)
            .field('educationDay', educationDay)
            .attach('files', fileBuffer, 'fake-image.png');
    }

    if(!visible){
        const academicLevel = await sequelize.models.AcademicLevels.findAll();
        await academicLevel[academicLevel.length - 1].update({visible: false});
    }
    return res;
}

module.exports = {createCampus, createAcademicLevels};