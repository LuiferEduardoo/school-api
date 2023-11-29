'use strict';

const {
  FILES_REGISTRATION_TABLE,
} = require('../models/filesRegistration.model');
const { ROL_USER_TABLE } = require('../models/rolUser.model');
const { SCHOOL_GRADE_TABLE } = require('../models/schoolGrade.model');
const { CATEGORIES_TABLE } = require('../models/categories.model');
const { SUBCATEGORIES_TABLE } = require('../models/subcategories.model');
const { TAGS_TABLE } = require('../models/tags.model');
const { NEWS_PUBLICATIONS_TABLE } = require('../models/newsPublications.model');
const {
  INSTITUTIONAL_PROJECTS_TABLE,
} = require('../models/institutionalProjects.model');
const { SUBJECT_TABLE } = require('../models/subject.model');

const { USER_TABLE } = require('../models/user.model');
const { ROL_TABLE } = require('../models/rol.model');
const { ACADEMIC_LEVELS_TABLE } = require('../models/academicLevels.model');
const { CLASIFICATION_TABLE } = require('../models/clasification.model');
const { PUBLICATIONS_TABLE } = require('../models/publications.model');
const { SUBJECT_NAME_TABLE } = require('../models/subjectName.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(FILES_REGISTRATION_TABLE, {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      folder: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      url: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      isPublic: {
        field: 'is_public',
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      userId: {
        field: 'user_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: USER_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      removedAt: {
        type: Sequelize.DataTypes.DATE,
        field: 'removed_at',
        defaultValue: null,
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
    await queryInterface.createTable(ROL_USER_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      userId: {
        field: 'user_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        unique: true,
        references: {
          model: USER_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      rolId: {
        field: 'rol_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: ROL_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });
    await queryInterface.createTable(SCHOOL_GRADE_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      grade: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
      },
      academicLevel: {
        field: 'academic_level',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        unique: true,
        references: {
          model: ACADEMIC_LEVELS_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });
    await queryInterface.createTable(CATEGORIES_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      clasificationId: {
        field: 'clasification_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: CLASIFICATION_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
    });
    await queryInterface.createTable(SUBCATEGORIES_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      clasificationId: {
        field: 'clasification_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: CLASIFICATION_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
    });
    await queryInterface.createTable(TAGS_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      clasificationId: {
        field: 'clasification_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: CLASIFICATION_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
    });
    await queryInterface.createTable(NEWS_PUBLICATIONS_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      publicationId: {
        field: 'publication_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: PUBLICATIONS_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      userId: {
        field: 'user_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: USER_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      important: {
        defaultValue: false,
        type: Sequelize.DataTypes.BOOLEAN,
      },
    });
    await queryInterface.createTable(INSTITUTIONAL_PROJECTS_TABLE, {
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
      coordinatorId: {
        field: 'coordinator_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: USER_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      important: {
        defaultValue: false,
        type: Sequelize.DataTypes.BOOLEAN,
      },
      visible: {
        defaultValue: true,
        type: Sequelize.DataTypes.BOOLEAN,
      },
      startedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        field: 'started_at',
      },
      finishedAT: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        field: 'finished_at',
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
    await queryInterface.createTable(SUBJECT_TABLE, {
      id: {
          allowNull: false,
          autoIncrement: true, 
          primaryKey: true,
          type: Sequelize.DataTypes.INTEGER
      },
      subjectNameId: {
          field: 'subject_name_id',
          allowNull: false,
          type: Sequelize.DataTypes.INTEGER,
          references: {
              model: SUBJECT_NAME_TABLE,
              key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
      },
      academicLevelId: {
          field: 'academic_level_id',
          allowNull: false,
          type: Sequelize.DataTypes.INTEGER,
          references: {
              model: ACADEMIC_LEVELS_TABLE,
              key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
      },
      teacherId: {
          field: 'teacher_id',
          allowNull: false,
          type: Sequelize.DataTypes.INTEGER,
          references: {
              model: USER_TABLE,
              key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(FILES_REGISTRATION_TABLE);
    await queryInterface.dropTable(ROL_USER_TABLE);
    await queryInterface.dropTable(SCHOOL_GRADE_TABLE);
    await queryInterface.dropTable(CATEGORIES_TABLE);
    await queryInterface.dropTable(SUBCATEGORIES_TABLE);
    await queryInterface.dropTable(TAGS_TABLE);
    await queryInterface.dropTable(NEWS_PUBLICATIONS_TABLE);
    await queryInterface.dropTable(INSTITUTIONAL_PROJECTS_TABLE);
    await queryInterface.dropTable(SUBJECT_TABLE);
  },
};
