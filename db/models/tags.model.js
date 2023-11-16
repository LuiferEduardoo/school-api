const { Model, DataTypes, Sequelize } = require('sequelize'); 
const { CLASIFICATION_TABLE } = require('./clasification.model');

const TAGS_TABLE = "tags"; 

const tagsSchema = {
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

class Tags extends Model {
    static associations(models){ 
        this.belongsTo(models.Clasification, {
            as: 'clasification',
            foreignKey: 'clasificationId'
        });

    }
    static config(sequelize){
        return {
        sequelize,
        tableName: TAGS_TABLE,
        modelName: 'Tags',
        timestamps: false
        }    
    }
}

module.exports = { TAGS_TABLE, tagsSchema, Tags }