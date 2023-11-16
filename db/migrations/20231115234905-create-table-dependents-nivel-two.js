'use strict';

const { CATEGORIES_PUBLICATIONS_TABLE, categoriesPublicationsSchema } = require('../models/categoriesPublications.model');
const { SUBCATEGORIES_PUBLICATIONS_TABLE, subcategoriesPublicationsSchema} = require('../models/subcategoriesPublications.model'); 
const { TAGS_PUBLICATIONS_TABLE, tagsPublicationsSchema } = require('../models/tagsPublications.model');
const { SCHUDULE_TABLE, SchuduleSchema } = require('../models/schedule.model'); 
const { SUBJECT_TABLE, SubjectSchema } = require('../models/subject.model'); 
const { FILES_REGISTRATION_TABLE, filesRegistrationSchema} = require('../models/filesRegistration.model');
const { INSTITUTIONAL_PROJECTS_TABLE, InstitutionalProjectsSchema } = require('../models/institutionalProjects.model');
const { NEWS_PUBLICATIONS_TABLE, NewsPublicationsSchema } = require('../models/newsPublications.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(FILES_REGISTRATION_TABLE, filesRegistrationSchema);
    await queryInterface.createTable(NEWS_PUBLICATIONS_TABLE, NewsPublicationsSchema);
    await queryInterface.createTable(INSTITUTIONAL_PROJECTS_TABLE, InstitutionalProjectsSchema);
    await queryInterface.createTable(CATEGORIES_PUBLICATIONS_TABLE, categoriesPublicationsSchema);
    await queryInterface.createTable(SUBCATEGORIES_PUBLICATIONS_TABLE, subcategoriesPublicationsSchema);
    await queryInterface.createTable(TAGS_PUBLICATIONS_TABLE, tagsPublicationsSchema);
    await queryInterface.createTable(SUBJECT_TABLE, SubjectSchema);
    await queryInterface.createTable(SCHUDULE_TABLE, SchuduleSchema);
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(FILES_REGISTRATION_TABLE);
    await queryInterface.dropTable(NEWS_PUBLICATIONS_TABLE);
    await queryInterface.dropTable(INSTITUTIONAL_PROJECTS_TABLE);
    await queryInterface.dropTable(CATEGORIES_PUBLICATIONS_TABLE);
    await queryInterface.dropTable(SUBCATEGORIES_PUBLICATIONS_TABLE);
    await queryInterface.dropTable(TAGS_PUBLICATIONS_TABLE);
    await queryInterface.dropTable(SUBJECT_TABLE);
    await queryInterface.dropTable(SCHUDULE_TABLE);
  }
};
