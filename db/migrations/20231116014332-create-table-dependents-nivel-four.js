'use strict';

const { IMAGE_INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE, imageInstitutionaProjectsPublicationsSchema } = require('../models/imageInstitutionalProjectPublications.model');
const { IMAGE_NEWS_TABLE, imageNewsSchema} = require('../models/imageNews.model');
const { IMAGE_INSTITUTIONAL_PROJECTS_TABLE, imageInstitutionaProjectsSchema } = require('../models/imageInstitutionalProjects.model');
const { IMAGE_BANNERS_TABLE, imageBannersSchema } = require('../models/imageBanners.model');
const { INSTITUTIONAL_PROJECTS_PUBLICATIONS_AUTHORS_TABLE, InstitutionalProjectsPublicationsAuthorsSchema } = require('../models/institucionalProjectPublicationAuthors.model');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(INSTITUTIONAL_PROJECTS_PUBLICATIONS_AUTHORS_TABLE, InstitutionalProjectsPublicationsAuthorsSchema);
    await queryInterface.createTable(IMAGE_NEWS_TABLE, imageNewsSchema);
    await queryInterface.createTable(IMAGE_INSTITUTIONAL_PROJECTS_TABLE, imageInstitutionaProjectsSchema);
    await queryInterface.createTable(IMAGE_INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE, imageInstitutionaProjectsPublicationsSchema);
    await queryInterface.createTable(IMAGE_BANNERS_TABLE, imageBannersSchema);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(INSTITUTIONAL_PROJECTS_PUBLICATIONS_AUTHORS_TABLE);
    await queryInterface.dropTable(IMAGE_NEWS_TABLE);
    await queryInterface.dropTable(IMAGE_INSTITUTIONAL_PROJECTS_TABLE);
    await queryInterface.dropTable(IMAGE_INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE);
    await queryInterface.dropTable(IMAGE_BANNERS_TABLE);
  }
};
