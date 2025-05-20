const { Model, DataTypes, Sequelize } = require('sequelize');
const { INSTITUTIONAL_PROJECTS_MEMBERS_TABLE } = require('./institucionalProjectMembers.model');
const { INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE } = require('./institutionalProjectsPublications.model')

const INSTITUTIONAL_PROJECTS_PUBLICATIONS_AUTHORS_TABLE = "institutional_projects_publications_authors"; 

const InstitutionalProjectsPublicationsAuthorsSchema = {
    id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    institutionalProjectsPublicationId: {
        field: 'institutional_project_publication_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    authorId:{
        field: 'author_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: INSTITUTIONAL_PROJECTS_MEMBERS_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    }
}

class InstitutionalProjectsPublicationsAuthors extends Model {
    static associate(models){ 
        this.belongsTo(models.InstitutionalProjectsMember, {
            as: 'author',
            foreignKey: 'authorId'
        });
        this.belongsTo(models.InstitutionalProjectsPublications, {
            as: 'institutionalProjectPublication',
            foreignKey: 'institutionalProjectsPublicationId'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: INSTITUTIONAL_PROJECTS_PUBLICATIONS_AUTHORS_TABLE,
        modelName: 'InstitutionalProjectsPublicationsAuthors',
        timestamps: false
        }    
    }
}

module.exports = { INSTITUTIONAL_PROJECTS_PUBLICATIONS_AUTHORS_TABLE, InstitutionalProjectsPublicationsAuthorsSchema, InstitutionalProjectsPublicationsAuthors }