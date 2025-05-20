'use strict';

const {
  ADMINISTRATION_REQUEST_TABLE,
} = require('../models/admissionRequest.model');
const { SCHUDULE_TABLE } = require('../models/schedule.model');
const {
  INSTITUTIONAL_PROJECTS_PUBLICATIONS_AUTHORS_TABLE,
} = require('../models/institucionalProjectPublicationAuthors.model');
const { IMAGE_USER_TABLE } = require('../models/imageUser.model');
const { IMAGE_NEWS_TABLE } = require('../models/imageNews.model');
const {
  IMAGE_INSTITUTIONAL_PROJECTS_TABLE,
} = require('../models/imageInstitutionalProjects.model');
const {
  IMAGE_INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE,
} = require('../models/imageInstitutionalProjectPublications.model');
const { IMAGE_BANNERS_TABLE } = require('../models/imageBanners.model');
const { IMAGE_ACADEMIC_LEVELS_TABLE } = require('../models/imageAcademicLevels.model')

const { SUBJECT_TABLE } = require('../models/subject.model');
const { SCHOOL_COURSES_TABLE } = require('../models/schoolCourses.model');
const { SCHEDULE_DAY_TABLE } = require('../models/scheduleDay.model');
const {
  INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE,
} = require('../models/institutionalProjectsPublications.model');
const {
  INSTITUTIONAL_PROJECTS_MEMBERS_TABLE,
} = require('../models/institucionalProjectMembers.model');
const {
  IMAGE_REGISTRAION_TABLE,
} = require('../models/imageRegistration.model');
const { USER_TABLE } = require('../models/user.model');
const { NEWS_PUBLICATIONS_TABLE } = require('../models/newsPublications.model');
const {
  INSTITUTIONAL_PROJECTS_TABLE,
} = require('../models/institutionalProjects.model');
const { ACADEMIC_LEVELS_TABLE } = require('../models/academicLevels.model');
const { SCHOOL_GRADE_TABLE } = require('../models/schoolGrade.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(ADMINISTRATION_REQUEST_TABLE, {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      academicLevel: {
        field: 'academic_level',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: ACADEMIC_LEVELS_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      grade: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: SCHOOL_GRADE_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      firstName: {
        type: Sequelize.DataTypes.TEXT,
        field: 'first_name',
        allowNull: false,
      },
      secondName: {
        type: Sequelize.DataTypes.TEXT,
        field: 'second_name',
        allowNull: true,
      },
      surname: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      secondSurname: {
        type: Sequelize.DataTypes.TEXT,
        field: 'second_surname',
        allowNull: true,
      },
      birthdate: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
      },
      gender: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT,
      },
      documentType: {
        type: Sequelize.DataTypes.TEXT,
        field: 'document_tipe',
        allowNull: false,
      },
      numberDocument: {
        type: Sequelize.DataTypes.TEXT,
        field: 'number_document',
        allowNull: false,
      },
      phoneNumber: {
        type: Sequelize.DataTypes.STRING(10),
        field: 'phone_number',
        allowNull: false,
      },
      email: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
        defaultValue: 'En revisión',
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
    await queryInterface.createTable(SCHUDULE_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      subjectId: {
        field: 'subject_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: SUBJECT_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      schoolCoursesId: {
        field: 'school_course_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: SCHOOL_COURSES_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      dayWeekId: {
        field: 'day_week_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: SCHEDULE_DAY_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      startTime: {
        allowNull: false,
        type: Sequelize.DataTypes.TIME,
        field: 'start_time',
      },
      endTime: {
        allowNull: false,
        type: Sequelize.DataTypes.TIME,
        field: 'end_time',
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
    await queryInterface.createTable(
      INSTITUTIONAL_PROJECTS_PUBLICATIONS_AUTHORS_TABLE,
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.DataTypes.INTEGER,
        },
        institutionalProjectsPublicationId: {
          field: 'institutional_project_publication_id',
          allowNull: false,
          type: Sequelize.DataTypes.INTEGER,
          references: {
            model: INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE,
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        authorId: {
          field: 'author_id',
          allowNull: false,
          type: Sequelize.DataTypes.INTEGER,
          references: {
            model: INSTITUTIONAL_PROJECTS_MEMBERS_TABLE,
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
      }
    );
    await queryInterface.createTable(IMAGE_USER_TABLE, {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      imageId: {
        field: 'image_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: IMAGE_REGISTRAION_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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
        onDelete: 'RESTRICT',
      },
    });
    await queryInterface.createTable(IMAGE_NEWS_TABLE, {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      imageId: {
        field: 'image_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: IMAGE_REGISTRAION_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      newsPublicationsId: {
        field: 'news_publications_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: NEWS_PUBLICATIONS_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
    });
    await queryInterface.createTable(IMAGE_INSTITUTIONAL_PROJECTS_TABLE, {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      imageId: {
        field: 'image_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: IMAGE_REGISTRAION_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      institutionalProjectsId: {
        field: 'projects_institutional_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: INSTITUTIONAL_PROJECTS_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
    });
    await queryInterface.createTable(
      IMAGE_INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE,
      {
        id: {
          type: Sequelize.DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        imageId: {
          field: 'image_id',
          allowNull: false,
          type: Sequelize.DataTypes.INTEGER,
          references: {
            model: IMAGE_REGISTRAION_TABLE,
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        },
        institutionalProjectsPublicationsId: {
          field: 'projects_institutional_publications_id',
          allowNull: false,
          type: Sequelize.DataTypes.INTEGER,
          references: {
            model: INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE,
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        },
      }
    );
    await queryInterface.createTable(IMAGE_BANNERS_TABLE, {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      imageId: {
        field: 'image_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: IMAGE_REGISTRAION_TABLE,
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
    });
    await queryInterface.createTable(IMAGE_ACADEMIC_LEVELS_TABLE, {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      imageId:{
          field: 'image_id',
          allowNull: false,
          type: Sequelize.DataTypes.INTEGER,
          references: {
              model: IMAGE_REGISTRAION_TABLE,
              key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
      },
      academicLevelsId:{
          field: 'academic_levels_id',
          allowNull: false,
          type: Sequelize.DataTypes.INTEGER,
          references: {
              model: ACADEMIC_LEVELS_TABLE,
              key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(ADMINISTRATION_REQUEST_TABLE);
    await queryInterface.dropTable(SCHUDULE_TABLE);
    await queryInterface.dropTable(
      INSTITUTIONAL_PROJECTS_PUBLICATIONS_AUTHORS_TABLE
    );
    await queryInterface.dropTable(IMAGE_USER_TABLE);
    await queryInterface.dropTable(IMAGE_NEWS_TABLE);
    await queryInterface.dropTable(IMAGE_INSTITUTIONAL_PROJECTS_TABLE);
    await queryInterface.dropTable(
      IMAGE_INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE
    );
    await queryInterface.dropTable(IMAGE_BANNERS_TABLE);
    await queryInterface.dropTable(IMAGE_ACADEMIC_LEVELS_TABLE);
  },
};
