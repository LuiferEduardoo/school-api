const { Model, DataTypes, Sequelize } = require('sequelize'); 
const { SUBCATEGORIES_TABLE } = require('./subcategories.model');
const { PUBLICATIONS_TABLE } = require('./publications.model')

const SUBCATEGORIES_PUBLICATIONS_TABLE = "subcategories_publications"; 

const subcategoriesPublicationsSchema = {
    id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    subcategoryId:{
        field: 'sucategory_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: SUBCATEGORIES_TABLE,
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

class SubcategoriesPublications extends Model {
    static associate(models){ 
        this.belongsTo(models.Subcategories, {
            as: 'subcategories',
            foreignKey: 'subcategoryId'
        });
        this.belongsTo(models.Publications, {
            as: 'publication',
            foreignKey: 'publicationId'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: SUBCATEGORIES_PUBLICATIONS_TABLE,
        modelName: 'SubcategoriesPublications',
        timestamps: false
        }    
    }
}

module.exports = { SUBCATEGORIES_PUBLICATIONS_TABLE, subcategoriesPublicationsSchema, SubcategoriesPublications }