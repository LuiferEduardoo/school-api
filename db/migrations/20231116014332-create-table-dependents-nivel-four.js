'use strict';

const { BANNERS_HOME_TABLE } = require('../models/bannersHome.model');
const {
  BANNERS_OUR_SCHOOL_TABLE,
} = require('../models/bannersOurSchool.model');
const {
  BANNERS_INSTITUTIONAL_PROJECTS_TABLE,
} = require('../models/bannersInstitutionalProjects.model');
const {
  BANNERS_ACADEMIC_LEVELS_TABLE,
} = require('../models/bannersAcademicLevels.model');
const { BANNERS_NEWS_TABLE } = require('../models/bannersNews.model');
const {
  BANNERS_ADMISSIONS_TABLE,
} = require('../models/bannersAdmissions.model');
const { BANNERS_CONTACT_TABLE } = require('../models/bannersContact.models');

const { IMAGE_BANNERS_TABLE } = require('../models/imageBanners.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(BANNERS_HOME_TABLE, {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      bannerId: {
        field: 'banner_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: IMAGE_BANNERS_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
    });
    await queryInterface.createTable(BANNERS_OUR_SCHOOL_TABLE, {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      bannerId: {
        field: 'banner_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: IMAGE_BANNERS_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
    });
    await queryInterface.createTable(BANNERS_INSTITUTIONAL_PROJECTS_TABLE, {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      bannerId: {
        field: 'banner_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: IMAGE_BANNERS_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
    });
    await queryInterface.createTable(BANNERS_ACADEMIC_LEVELS_TABLE, {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      bannerId: {
        field: 'banner_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: IMAGE_BANNERS_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
    });
    await queryInterface.createTable(BANNERS_NEWS_TABLE, {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      bannerId: {
        field: 'banner_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: IMAGE_BANNERS_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
    });
    await queryInterface.createTable(BANNERS_ADMISSIONS_TABLE, {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      bannerId: {
        field: 'banner_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: IMAGE_BANNERS_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
    });
    await queryInterface.createTable(BANNERS_CONTACT_TABLE, {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      bannerId: {
        field: 'banner_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: IMAGE_BANNERS_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(BANNERS_HOME_TABLE);
    await queryInterface.dropTable(BANNERS_OUR_SCHOOL_TABLE);
    await queryInterface.dropTable(BANNERS_INSTITUTIONAL_PROJECTS_TABLE);
    await queryInterface.dropTable(BANNERS_ACADEMIC_LEVELS_TABLE);
    await queryInterface.dropTable(BANNERS_NEWS_TABLE);
    await queryInterface.dropTable(BANNERS_ADMISSIONS_TABLE);
    await queryInterface.dropTable(BANNERS_CONTACT_TABLE);
  },
};
