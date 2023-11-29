const { Model, DataTypes, Sequelize } = require('sequelize'); 

const CLASIFICATION_TABLE = "clasification"; 

const ClasificationSchema = {
    id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name: {
        allowNull: false,
        type: DataTypes.TEXT,
        unique: true,
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'updated_at',
        defaultValue: Sequelize.NOW
    }
}

class Clasification extends Model {
    static associate(){ 

    }
    static config(sequelize){
        return {
        sequelize,
        tableName: CLASIFICATION_TABLE,
        modelName: 'Clasification',
        timestamps: false
        }    
    }
}

module.exports = { CLASIFICATION_TABLE, ClasificationSchema, Clasification }