'use strict';

const { RolUserSchema, ROL_USER_TABLE } = require('../models/rolUser.model');
const { ADMINISTRATION_REQUEST_TABLE, admissionRequestSchema} = require('../models/admissionRequest.model');
const { CALENDAR_TABLE, calendarSchema } = require('../models/calendar.model'); 
const { CATEGORIES_TABLE, CategoriesSchema } = require('../models/categories.model');
const { SUBCATEGORIES_TABLE, subcategoriesSchema } = require('../models/subcategories.model');
const { TAGS_TABLE, tagsSchema } = require('../models/tags.model');
const { SCHOOL_COURSES_TABLE, schoolCoursesSchema } = require('../models/schoolCourses.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(ADMINISTRATION_REQUEST_TABLE, admissionRequestSchema);
    await queryInterface.createTable(CALENDAR_TABLE, calendarSchema);
    await queryInterface.createTable(ROL_USER_TABLE, RolUserSchema);
    await queryInterface.createTable(CATEGORIES_TABLE, CategoriesSchema);
    await queryInterface.createTable(SUBCATEGORIES_TABLE, subcategoriesSchema);
    await queryInterface.createTable(TAGS_TABLE, tagsSchema);
    await queryInterface.createTable(SCHOOL_COURSES_TABLE, schoolCoursesSchema);
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(ADMINISTRATION_REQUEST_TABLE);
    await queryInterface.dropTable(CALENDAR_TABLE);
    await queryInterface.dropTable(ROL_USER_TABLE);
    await queryInterface.dropTable(CATEGORIES_TABLE);
    await queryInterface.dropTable(SUBCATEGORIES_TABLE);
    await queryInterface.dropTable(TAGS_TABLE);
    await queryInterface.dropTable(SCHOOL_COURSES_TABLE);
  }
};
