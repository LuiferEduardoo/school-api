'use strict';

const { INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE, InstitutionalProjectPublicationssSchema } = require('../models/institutionalProjectsPublications.model');
const { CATEGORIES_INSTITUTIONAL_PROJECTS_TABLE, categoriesInstitutionalProjectsSchema } = require('../models/categoriesInstitutionaProjects.model'); 
const { SUBCATEGORIES_INSTITUTIONAL_PROJECTS_TABLE, subcategoriesInstitutionalProjectsSchema } = require('../models/subcategoriesInstitutionalProjects.model');
const { TAGS_INSTITUTIONAL_PROJECTS_TABLE, tagsInstitutionalProjectsSchema } = require('../models/tagsInstitutionalProjects.model');
const { INSTITUTIONAL_PROJECTS_MEMBERS_TABLE, InstitutionalProjectsMemberSchema } = require('../models/institucionalProjectMembers.model');
const { IMAGE_REGISTRAION_TABLE, imageRegistrationSchema} = require('../models/imageRegistration.model');
const { DOCUMENT_REGISTRAION_TABLE, documentRegistrationSchema} = require('../models/documentRegistration.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(DOCUMENT_REGISTRAION_TABLE, documentRegistrationSchema);
    await queryInterface.createTable(IMAGE_REGISTRAION_TABLE, imageRegistrationSchema);
    await queryInterface.createTable(INSTITUTIONAL_PROJECTS_MEMBERS_TABLE, InstitutionalProjectsMemberSchema);
    await queryInterface.createTable(INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE, InstitutionalProjectPublicationssSchema);
    await queryInterface.createTable(CATEGORIES_INSTITUTIONAL_PROJECTS_TABLE, categoriesInstitutionalProjectsSchema);
    await queryInterface.createTable(SUBCATEGORIES_INSTITUTIONAL_PROJECTS_TABLE, subcategoriesInstitutionalProjectsSchema);
    await queryInterface.createTable(TAGS_INSTITUTIONAL_PROJECTS_TABLE, tagsInstitutionalProjectsSchema);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(DOCUMENT_REGISTRAION_TABLE);
    await queryInterface.dropTable(IMAGE_REGISTRAION_TABLE);
    await queryInterface.dropTable(INSTITUTIONAL_PROJECTS_MEMBERS_TABLE);
    await queryInterface.dropTable(INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE);
    await queryInterface.dropTable(CATEGORIES_INSTITUTIONAL_PROJECTS_TABLE);
    await queryInterface.dropTable(SUBCATEGORIES_INSTITUTIONAL_PROJECTS_TABLE);
    await queryInterface.dropTable(TAGS_INSTITUTIONAL_PROJECTS_TABLE);
  }
};
