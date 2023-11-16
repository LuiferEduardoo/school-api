'use strict';

const { BANNERS_HOME_TABLE, BannersHomeSchema } = require('../models/bannersHome.model');
const { BANNERS_OUR_SCHOOL_TABLE, BannersOurSchoolSchema } = require('../models/bannersOurSchool.model');
const { BANNERS_INSTITUTIONAL_PROJECTS_TABLE, BannersInstitutionalProjectsSchema } = require('../models/bannersInstitutionalProjects.model');
const { BANNERS_NEWS_TABLE, BannersNewsSchema } = require('../models/bannersNews.model');
const { BANNERS_ADMISSIONS_TABLE, BannersAdmissionsSchema } = require('../models/bannersAdmissions.model');
const { BANNERS_CONTACT_TABLE, BannersContactSchema } = require('../models/bannersContact.models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(BANNERS_HOME_TABLE, BannersHomeSchema);
    await queryInterface.createTable(BANNERS_OUR_SCHOOL_TABLE, BannersOurSchoolSchema);
    await queryInterface.createTable(BANNERS_INSTITUTIONAL_PROJECTS_TABLE, BannersInstitutionalProjectsSchema);
    await queryInterface.createTable(BANNERS_NEWS_TABLE, BannersNewsSchema);
    await queryInterface.createTable(BANNERS_ADMISSIONS_TABLE, BannersAdmissionsSchema);
    await queryInterface.createTable(BANNERS_CONTACT_TABLE, BannersContactSchema);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(BANNERS_HOME_TABLE);
    await queryInterface.dropTable(BANNERS_OUR_SCHOOL_TABLE);
    await queryInterface.dropTable(BANNERS_INSTITUTIONAL_PROJECTS_TABLE);
    await queryInterface.dropTable(BANNERS_NEWS_TABLE);
    await queryInterface.dropTable(BANNERS_ADMISSIONS_TABLE);
    await queryInterface.dropTable(BANNERS_CONTACT_TABLE);
  }
};
    