'use strict';

const { USER_TABLE } = require('../models/user.model');
const { ROL_TABLE } = require('../models/rol.model');
const { PUBLICATIONS_TABLE } = require('../models/publications.model');
const { CLASIFICATION_TABLE } = require('../models/clasification.model');
const { CALENDAR_TABLE } = require('../models/calendar.model');
const { ACADEMIC_LEVELS_TABLE } = require('../models/academicLevels.model');
const { SUBJECT_NAME_TABLE } = require('../models/subjectName.model');
const { SCHEDULE_DAY_TABLE } = require('../models/scheduleDay.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(USER_TABLE, {
      id: {
          allowNull: false,
          autoIncrement: true, 
          primaryKey: true,
          type: Sequelize.DataTypes.INTEGER
      },
      name: {
          allowNull: false,
          type: Sequelize.DataTypes.STRING,
      },
      lastName: {
          field: 'last_name',
          allowNull: false,
          type: Sequelize.DataTypes.STRING,
      },
      username: {
          allowNull: false,
          type: Sequelize.DataTypes.STRING,
          unique: true,
      },
      email: {
          allowNull: false,
          type: Sequelize.DataTypes.STRING,
          unique: true,
      },
      password: {
          allowNull: false,
          type: Sequelize.DataTypes.STRING
      },
      active: {
          defaultValue: true,
          type: Sequelize.DataTypes.BOOLEAN
      },
      online: {
          defaultValue: false,
          type: Sequelize.DataTypes.BOOLEAN
      },
      recoveryToken: {
          allowNull: true,
          field: 'recovery_token',
          type: Sequelize.DataTypes.STRING
      },
      lastOnline: {
          allowNull: true,
          type: Sequelize.DataTypes.DATE,
          field: 'last_online',
      },
      createdAt: {
          allowNull: false,
          type: Sequelize.DataTypes.DATE,
          field: 'created_at',
          defaultValue: Sequelize.NOW
      },
      updatedAt: {
          allowNull: false,
          type: Sequelize.DataTypes.DATE,
          field: 'updated_at',
          defaultValue: Sequelize.NOW
      }
    });
    await queryInterface.createTable(ROL_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      rol: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
    });
    await queryInterface.createTable(PUBLICATIONS_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      title: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      content: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      link: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
        unique: true,
      },
      reading_time: {
        allowNull: false,
        type: Sequelize.DataTypes.TIME,
      },
      important: {
        defaultValue: false,
        type: Sequelize.DataTypes.BOOLEAN,
      },
      visible: {
        defaultValue: true,
        type: Sequelize.DataTypes.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        field: 'updated_at',
        defaultValue: Sequelize.NOW,
      },
    });
    await queryInterface.createTable(CLASIFICATION_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        field: 'updated_at',
        defaultValue: Sequelize.NOW,
      },
    });
    await queryInterface.createTable(CALENDAR_TABLE, {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      visible: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      startDate: {
        type: Sequelize.DataTypes.DATE,
        field: 'start_date',
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DataTypes.DATE,
        field: 'end_date',
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        field: 'updated_at',
        defaultValue: Sequelize.NOW,
      },
    });
    await queryInterface.createTable(ACADEMIC_LEVELS_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      nameLevel: {
        field: 'name_level',
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      description: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      levelCode: {
        field: 'level_code',
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
        unique: true,
      },
      campus: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER
      },
      modality: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      educationalObjectives: {
        field: 'educational_objetive',
        allowNull: true,
        type: Sequelize.DataTypes.TEXT,
      },
      admissionRequirements: {
        field: 'admission_requirements',
        allowNull: true,
        type: Sequelize.DataTypes.TEXT,
      },
      visible: {
        defaultValue: true,
        type: Sequelize.DataTypes.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        field: 'updated_at',
        defaultValue: Sequelize.NOW,
      },
    });
    await queryInterface.createTable(SUBJECT_NAME_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
    });
    await queryInterface.createTable(SCHEDULE_DAY_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      dayweek: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
        field: 'day_week',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(USER_TABLE);
    await queryInterface.dropTable(ROL_TABLE);
    await queryInterface.dropTable(PUBLICATIONS_TABLE);
    await queryInterface.dropTable(CLASIFICATION_TABLE);
    await queryInterface.dropTable(CALENDAR_TABLE);
    await queryInterface.dropTable(ACADEMIC_LEVELS_TABLE);
    await queryInterface.dropTable(SUBJECT_NAME_TABLE);
  },
};
