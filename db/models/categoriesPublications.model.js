const { Model, DataTypes, Sequelize } = require('sequelize'); 
const { CATEGORIES_TABLE } = require('./categories.model');
const { PUBLICATIONS_TABLE } = require('./publications.model')

const CATEGORIES_PUBLICATIONS_TABLE = "categories_publications"; 

const categoriesPublicationsSchema = {
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
    publicationId: {
        field: 'publication_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: PUBLICATIONS_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    }
}

class CategoriesPublications extends Model {
    static associate(models){ 
        this.belongsTo(models.Categories, {
            as: 'categories',
            foreignKey: 'categoryId'
        });
        this.belongsTo(models.Publications, {
            as: 'publication',
            foreignKey: 'publicationId'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: CATEGORIES_PUBLICATIONS_TABLE,
        modelName: 'CategoriesPublications',
        timestamps: false
        }    
    }
}

module.exports = { CATEGORIES_PUBLICATIONS_TABLE, categoriesPublicationsSchema, CategoriesPublications }