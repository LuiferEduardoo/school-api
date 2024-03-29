const { Model, DataTypes, Sequelize } = require('sequelize');
const { USER_TABLE } = require('./user.model');
const { PUBLICATIONS_TABLE } = require('./publications.model');

const NEWS_PUBLICATIONS_TABLE = "news_publications"; 

const NewsPublicationsSchema = {
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
    userId:{
        field: 'user_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: USER_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    important: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
    }
}

class NewsPublications extends Model {
    static associate(models){ 
        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId'
        });
        this.belongsTo(models.Publications, {
            as: 'publication',
            foreignKey: 'publicationId'
        });
        this.hasMany(models.ImageNews, {
            as: 'imageNews',
            foreignKey: 'newsPublicationsId',
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: NEWS_PUBLICATIONS_TABLE,
        modelName: 'NewsPublications',
        timestamps: false
        }    
    }
}

module.exports = { NEWS_PUBLICATIONS_TABLE, NewsPublicationsSchema, NewsPublications }