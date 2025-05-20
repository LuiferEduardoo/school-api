const { Model, DataTypes } = require('sequelize');
const { TAGS_TABLE } = require('./tags.model');
const { INSTITUTIONAL_PROJECTS_TABLE } = require('./institutionalProjects.model');

const TAGS_INSTITUTIONAL_PROJECTS_TABLE = "tags_institutional_projects";

const tagsInstitutionalProjectsSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    tagId: {
        field: 'tag_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: TAGS_TABLE,
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

class TagsInstitutionalProjects extends Model {
    static associate(models) {
        this.belongsTo(models.Tags, {
            foreignKey: 'tagId',
            as: 'tags' 
        });
        this.belongsTo(models.InstitutionalProjects, {
            foreignKey: 'institutionalProjectId',
            as: 'institutionalProject' 
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            tableName: TAGS_INSTITUTIONAL_PROJECTS_TABLE,
            modelName: 'TagsInstitutionalProjects',
            timestamps: false
        };
    }
}

module.exports = { TAGS_INSTITUTIONAL_PROJECTS_TABLE, tagsInstitutionalProjectsSchema, TagsInstitutionalProjects };
