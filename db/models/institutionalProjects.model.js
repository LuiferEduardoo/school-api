const { Model, DataTypes, Sequelize } = require('sequelize');
const { ROL_USER_TABLE } = require('./rolUser.model');

const INSTITUTIONAL_PROJECTS_TABLE = "institutional_projects"; 

const InstitutionalProjectsSchema = {
    id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    title: {
        allowNull: false,
        type: DataTypes.TEXT,
    },
    content: {
        allowNull: false,
        type: DataTypes.TEXT,
    },
    link: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
    },
    coordinatorId:{
        field: 'coordinator_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: ROL_USER_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    },
    important: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
    },
    visible: {
        defaultValue: true,
        type: DataTypes.BOOLEAN
    },
    startedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'started_at',
    },
    finishedAT: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'finished_at',
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'create_at',
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'updated_at',
        defaultValue: Sequelize.NOW
    }
}

class InstitutionalProjects extends Model {
    static associations(models){ 
        this.belongsTo(models.RolUser, {
            as: 'coordinator',
            foreignKey: 'coordinatorId'
        });
        this.hasMany(models.ImageInstitutionalProjects, {
            as: 'ImageInstitutionalProjects',
            foreignKey: 'institutionalProjectsId',
        });
        this.hasMany(models.InstitutionalProjectsMember, {
            as: 'InstitutionalProjectsMember',
            foreignKey: 'institutionalProjectsId',
        });
        this.hasMany(models.CategoriesInstitutionalProjects, {
            as: 'categories',
            foreignKey: 'categoryId',
        });
        this.hasMany(models.SubcategoriesInstitutionalProjects, {
            as: 'subcategories',
            foreignKey: 'subcategoryId',
        });
        this.hasMany(models.TagsInstitutionalProjects, {
            as: 'tags',
            foreignKey: 'tagId',
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: INSTITUTIONAL_PROJECTS_TABLE,
        modelName: 'InstitutionalProjects',
        timestamps: false
        }    
    }
}

module.exports = { INSTITUTIONAL_PROJECTS_TABLE, InstitutionalProjectsSchema, InstitutionalProjects }