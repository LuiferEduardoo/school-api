const { Model, DataTypes, Sequelize } = require('sequelize');
const { USER_TABLE } = require('./user.model');

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
            model: USER_TABLE,
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
        field: 'created_at',
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
    static associate(models){ 
        this.belongsTo(models.User, {
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
            foreignKey: 'institutionalProjectsId',
        });
        this.hasMany(models.SubcategoriesInstitutionalProjects, {
            as: 'subcategories',
            foreignKey: 'institutionalProjectsId',
        });
        this.hasMany(models.TagsInstitutionalProjects, {
            as: 'tags',
            foreignKey: 'institutionalProjectsId',
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