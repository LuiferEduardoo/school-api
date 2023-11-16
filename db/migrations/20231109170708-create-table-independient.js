'use strict';

const { UserSchema, USER_TABLE} = require('../models/user.model');
const { RolSchema, ROL_TABLE } = require('../models/rol.model');
const { PUBLICATIONS_TABLE, PublicationsSchema } = require('../models/publications.model');
const { CLASIFICATION_TABLE, ClasificationSchema } = require('../models/clasification.model');
const { SUBJECT_NAME_TABLE, subjectNameSchema } = require('../models/subjectName.model');
const { SCHEDULE_DAY_TABLE, ScheduleDaySchema } = require('../models/scheduleDay.model');
const { SCHOOL_GRADE_TABLE, schoolGradeSchema } = require('../models/schoolGrade.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(USER_TABLE, UserSchema);
    await queryInterface.createTable(ROL_TABLE, RolSchema);
    await queryInterface.createTable(PUBLICATIONS_TABLE, PublicationsSchema);
    await queryInterface.createTable(CLASIFICATION_TABLE, ClasificationSchema);
    await queryInterface.createTable(SCHOOL_GRADE_TABLE, schoolGradeSchema);
    await queryInterface.createTable(SUBJECT_NAME_TABLE, subjectNameSchema);
    await queryInterface.createTable(SCHEDULE_DAY_TABLE, ScheduleDaySchema);
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(USER_TABLE);
    await queryInterface.dropTable(ROL_TABLE);
    await queryInterface.dropTable(PUBLICATIONS_TABLE);
    await queryInterface.dropTable(CLASIFICATION_TABLE);
    await queryInterface.dropTable(SCHOOL_GRADE_TABLE);
    await queryInterface.dropTable(SUBJECT_NAME_TABLE);
    await queryInterface.dropTable(SCHEDULE_DAY_TABLE);
  }
};