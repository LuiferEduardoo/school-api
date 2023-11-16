const { Model, DataTypes, Sequelize } = require('sequelize'); 

const { IMAGE_REGISTRAION_TABLE } = require('./imageRegistration.model'); 
const { NEWS_PUBLICATIONS_TABLE } = require('./newsPublications.model')

const IMAGE_NEWS_TABLE = "image_news"; 

const imageNewsSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    imageId:{
        field: 'image_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: IMAGE_REGISTRAION_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    },
    newsPublicationsId:{
        field: 'news_publications_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: NEWS_PUBLICATIONS_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    }
}

class ImageNews extends Model {
    static associations(models){ 
        this.belongsTo(models.ImageRegistration, {
            as: 'image',
            foreignKey: 'imageId'
        });
        this.belongsTo(models.NewsPublications, {
            as: 'newsPublications',
            foreignKey: 'newsPublicationsId'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: IMAGE_NEWS_TABLE,
        modelName: 'ImageNews',
        timestamps: false
        }    
    }
}

module.exports = { IMAGE_NEWS_TABLE, imageNewsSchema, ImageNews }