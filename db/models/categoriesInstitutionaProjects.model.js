const { Model, DataTypes, Sequelize } = require('sequelize'); 
const { CATEGORIES_TABLE } = require('./categories.model');
const { INSTITUTIONAL_PROJECTS_TABLE } = require('./institutionalProjects.model')

const CATEGORIES_INSTITUTIONAL_PROJECTS_TABLE = "categories_institutional_projects"; 

const categoriesInstitutionalProjectsSchema = {
    id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    categoryId:{
        field: 'category_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: CATEGORIES_TABLE,
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
        onDelete: 'SET NULL'
    }
}

class CategoriesInstitutionalProjects extends Model {
    static associations(models){ 
        this.belongsTo(models.Categories, {
            as: 'categories',
            foreignKey: 'categoryId'
        });
        this.belongsTo(models.InstitutionalProjects, {
            as: 'institutionalProjects',
            foreignKey: 'institutionalProjectId'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: CATEGORIES_INSTITUTIONAL_PROJECTS_TABLE,
        modelName: 'CategoriesInstitutionalProjects',
        timestamps: false
        }    
    }
}

module.exports = { CATEGORIES_INSTITUTIONAL_PROJECTS_TABLE, categoriesInstitutionalProjectsSchema, CategoriesInstitutionalProjects }