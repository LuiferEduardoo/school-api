const { Model, DataTypes, Sequelize } = require('sequelize');
const { PUBLICATIONS_TABLE } = require('./publications.model');
const { INSTITUTIONAL_PROJECTS_TABLE } = require('./institutionalProjects.model');

const INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE = "institutional_projects_publications"; 

const InstitutionalProjectPublicationssSchema = {
    id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    publicationId:{
        field: 'publication_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: PUBLICATIONS_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    },
    InstitutionalProjectId:{
        field: 'institutional_project_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: INSTITUTIONAL_PROJECTS_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
}

class InstitutionalProjectsPublications extends Model {
    static associations(models){ 
        this.belongsTo(models.Publications, {
            as: 'publication',
            foreignKey: 'publicationId'
        });
        this.belongsTo(models.InstitutionalProjects, {
            as: 'institutionalProjects',
            foreignKey: 'InstitutionalProjectId'
        });
        this.hasMany(models.ImageInstitutionalProjectsPublications, {
            as: 'ImageInstitutionalProjectPublication',
            foreignKey: 'institutionalProjectsPublicationsId',
        });
        this.hasMany(models.InstitutionalProjectsPublicationsAuthors, {
            as: 'InstitutionalProjectsPublicationsAuthors',
            foreignKey: 'institutionalProjectsPublicationId',
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE,
        modelName: 'InstitutionalProjectsPublications',
        timestamps: false
        }    
    }
}

module.exports = { INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE, InstitutionalProjectPublicationssSchema, InstitutionalProjectsPublications }