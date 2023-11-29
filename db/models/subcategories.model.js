const { Model, DataTypes, Sequelize } = require('sequelize'); 
const { CLASIFICATION_TABLE } = require('./clasification.model');

const SUBCATEGORIES_TABLE = "subcategories"; 

const subcategoriesSchema = {
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

class Subcategories extends Model {
    static associate(models){ 
        this.belongsTo(models.Clasification, {
            as: 'clasification',
            foreignKey: 'clasificationId'
        });

    }
    static config(sequelize){
        return {
        sequelize,
        tableName: SUBCATEGORIES_TABLE,
        modelName: 'Subcategories',
        timestamps: false
        }    
    }
}

module.exports = { SUBCATEGORIES_TABLE, subcategoriesSchema, Subcategories }