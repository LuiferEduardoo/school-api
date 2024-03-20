'use strict';

const { SCHOOL_COURSES_TABLE } = require('../models/schoolCourses.model');
const {
  CATEGORIES_PUBLICATIONS_TABLE,
} = require('../models/categoriesPublications.model');
const {
  SUBCATEGORIES_PUBLICATIONS_TABLE,
} = require('../models/subcategoriesPublications.model');
const { TAGS_PUBLICATIONS_TABLE } = require('../models/tagsPublications.model');
const {
  DOCUMENT_REGISTRAION_TABLE,
} = require('../models/documentRegistration.model');
const {
  IMAGE_REGISTRAION_TABLE,
} = require('../models/imageRegistration.model');
const {
  INSTITUTIONAL_PROJECTS_MEMBERS_TABLE,
} = require('../models/institucionalProjectMembers.model');
const {
  INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE,
} = require('../models/institutionalProjectsPublications.model');
const {
  CATEGORIES_INSTITUTIONAL_PROJECTS_TABLE,
} = require('../models/categoriesInstitutionaProjects.model');
const {
  SUBCATEGORIES_INSTITUTIONAL_PROJECTS_TABLE,
} = require('../models/subcategoriesInstitutionalProjects.model');
const {
  TAGS_INSTITUTIONAL_PROJECTS_TABLE,
} = require('../models/tagsInstitutionalProjects.model');
const { SCHOOL_GRADE_TABLE } = require('../models/schoolGrade.model');

const { USER_TABLE } = require('../models/user.model');
const { ACADEMIC_LEVELS_TABLE } = require('../models/academicLevels.model');
const { CATEGORIES_TABLE } = require('../models/categories.model');
const { SUBCATEGORIES_TABLE } = require('../models/subcategories.model');
const { TAGS_TABLE } = require('../models/tags.model');
const {
  FILES_REGISTRATION_TABLE,
} = require('../models/filesRegistration.model');
const { PUBLICATIONS_TABLE } = require('../models/publications.model');
const {
  INSTITUTIONAL_PROJECTS_TABLE,
} = require('../models/institutionalProjects.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
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
    await queryInterface.createTable(SCHOOL_COURSES_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      schoolGradeId: {
        field: 'school_grade_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: SCHOOL_GRADE_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      course: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
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
    await queryInterface.createTable(CATEGORIES_PUBLICATIONS_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      categoryId: {
        field: 'category_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: CATEGORIES_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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
        onDelete: 'SET NULL',
      },
    });
    await queryInterface.createTable(SUBCATEGORIES_PUBLICATIONS_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      subcategoryId: {
        field: 'sucategory_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: SUBCATEGORIES_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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
    });
    await queryInterface.createTable(TAGS_PUBLICATIONS_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      tagId: {
        field: 'tag_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: TAGS_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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
    });
    await queryInterface.createTable(DOCUMENT_REGISTRAION_TABLE, {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      fileId: {
        field: 'file_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: FILES_REGISTRATION_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
    });
    await queryInterface.createTable(IMAGE_REGISTRAION_TABLE, {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fileId: {
        field: 'file_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: FILES_REGISTRATION_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      imageCredits: {
        field: 'image_credits',
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
    });
    await queryInterface.createTable(INSTITUTIONAL_PROJECTS_MEMBERS_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      institutionalProjectsId: {
        field: 'institutional_projects_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: INSTITUTIONAL_PROJECTS_TABLE,
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
        onDelete: 'RESTRICT',
      },
      isCoordinator:{
        field: 'is_coordinator',
        allowNull: true,
        type: Sequelize.DataTypes.BOOLEAN,    
        defaultValue: false
    }
    });
    await queryInterface.createTable(
      INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE,
      {
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
        InstitutionalProjectId: {
          field: 'institutional_project_id',
          allowNull: false,
          type: Sequelize.DataTypes.INTEGER,
          references: {
            model: INSTITUTIONAL_PROJECTS_TABLE,
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
      }
    );
    await queryInterface.createTable(CATEGORIES_INSTITUTIONAL_PROJECTS_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      categoryId: {
        field: 'category_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: CATEGORIES_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      institutionalProjectId: {
        field: 'institutional_project_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: INSTITUTIONAL_PROJECTS_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });
    await queryInterface.createTable(
      SUBCATEGORIES_INSTITUTIONAL_PROJECTS_TABLE,
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.DataTypes.INTEGER,
        },
        subcategoryId: {
          field: 'subcategory_id',
          allowNull: false,
          type: Sequelize.DataTypes.INTEGER,
          references: {
            model: SUBCATEGORIES_TABLE,
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        },
        institutionalProjectId: {
          field: 'institutional_project_id',
          allowNull: false,
          type: Sequelize.DataTypes.INTEGER,
          references: {
            model: INSTITUTIONAL_PROJECTS_TABLE,
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        },
      }
    );
    await queryInterface.createTable(TAGS_INSTITUTIONAL_PROJECTS_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      tagId: {
        field: 'tag_id',
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: TAGS_TABLE,
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      institutionalProjectId: {
        field: 'institutional_project_id',
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(SCHOOL_GRADE_TABLE);
    await queryInterface.dropTable(SCHOOL_COURSES_TABLE);
    await queryInterface.dropTable(CATEGORIES_PUBLICATIONS_TABLE);
    await queryInterface.dropTable(SUBCATEGORIES_PUBLICATIONS_TABLE);
    await queryInterface.dropTable(TAGS_PUBLICATIONS_TABLE);
    await queryInterface.dropTable(DOCUMENT_REGISTRAION_TABLE);
    await queryInterface.dropTable(IMAGE_REGISTRAION_TABLE);
    await queryInterface.dropTable(INSTITUTIONAL_PROJECTS_MEMBERS_TABLE);
    await queryInterface.dropTable(INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE);
    await queryInterface.dropTable(CATEGORIES_INSTITUTIONAL_PROJECTS_TABLE);
    await queryInterface.dropTable(SUBCATEGORIES_INSTITUTIONAL_PROJECTS_TABLE);
    await queryInterface.dropTable(TAGS_INSTITUTIONAL_PROJECTS_TABLE);
  },
};
