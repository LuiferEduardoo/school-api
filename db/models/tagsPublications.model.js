const { Model, DataTypes, Sequelize } = require('sequelize'); 
const { TAGS_TABLE } = require('./tags.model');
const { PUBLICATIONS_TABLE } = require('./publications.model')

const TAGS_PUBLICATIONS_TABLE = "tags_publications"; 

const tagsPublicationsSchema = {
    id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    tagId:{
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
    publicationId: {
        field: 'publication_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: PUBLICATIONS_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    }
}

class TagsPublications extends Model {
    static associations(models){ 
        this.belongsTo(models.Tags, {
            as: 'tags',
            foreignKey: 'tagId'
        });
        this.belongsTo(models.Publications, {
            as: 'publication',
            foreignKey: 'publicationId'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: TAGS_PUBLICATIONS_TABLE,
        modelName: 'TagsPublications',
        timestamps: false
        }    
    }
}

module.exports = { TAGS_PUBLICATIONS_TABLE, tagsPublicationsSchema, TagsPublications }