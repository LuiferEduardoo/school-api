const { Model, DataTypes, Sequelize } = require('sequelize'); 
const { CLASIFICATION_TABLE } = require('./clasification.model');

const CATEGORIES_TABLE = "categories"; 

const CategoriesSchema = {
    id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    clasificationId:{
        field: 'clasification_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: CLASIFICATION_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    },
}

class Categories extends Model {
    static associate(models){ 
        this.belongsTo(models.Clasification, {
            as: 'clasification',
            foreignKey: 'clasificationId'
        });

    }
    static config(sequelize){
        return {
        sequelize,
        tableName: CATEGORIES_TABLE,
        modelName: 'Categories',
        timestamps: false
        }    
    }
}

module.exports = { CATEGORIES_TABLE, CategoriesSchema, Categories }