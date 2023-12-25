const { Model, DataTypes } = require('sequelize');
const { SUBCATEGORIES_TABLE } = require('./subcategories.model');
const { INSTITUTIONAL_PROJECTS_TABLE } = require('./institutionalProjects.model');

const SUBCATEGORIES_INSTITUTIONAL_PROJECTS_TABLE = "subcategories_institutional_projects";

const subcategoriesInstitutionalProjectsSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    subcategoryId: {
        field: 'subcategory_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: SUBCATEGORIES_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    },
    institutionalProjectId: {
        field: 'institutional_project_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: INSTITUTIONAL_PROJECTS_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    }
};

class SubcategoriesInstitutionalProjects extends Model {
    static associate(models) {
        this.belongsTo(models.Subcategories, { 
            foreignKey: 'subcategoryId', 
            as: 'subcategories' 
        });
        this.belongsTo(models.InstitutionalProjects, {
            foreignKey: 'institutionalProjectId', 
            as: 'institutionalProject' 
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: SUBCATEGORIES_INSTITUTIONAL_PROJECTS_TABLE,
            modelName: 'SubcategoriesInstitutionalProjects',
            timestamps: false
        };
    }
}

module.exports = { SUBCATEGORIES_INSTITUTIONAL_PROJECTS_TABLE, subcategoriesInstitutionalProjectsSchema, SubcategoriesInstitutionalProjects };
