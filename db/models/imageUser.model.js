const { Model, DataTypes, Sequelize } = require('sequelize'); 

const { IMAGE_REGISTRAION_TABLE } = require('./imageRegistration.model'); 
const { USER_TABLE } = require('./user.model')

const IMAGE_USER_TABLE = "image_user"; 

const imageUserSchema = {
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
    userId:{
        field: 'user_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        unique: true,
        references: {
            model: USER_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    }
}

class ImageUser extends Model {
    static associate(models){ 
        this.belongsTo(models.ImageRegistration, {
            as: 'image',
            foreignKey: 'imageId'
        });
        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: IMAGE_USER_TABLE,
        modelName: 'ImageUser',
        timestamps: false
        }    
    }
}

module.exports = { IMAGE_USER_TABLE, imageUserSchema, ImageUser }