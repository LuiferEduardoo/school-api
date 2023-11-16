const { Model, DataTypes, Sequelize } = require('sequelize'); 

const { FILES_REGISTRATION_TABLE } = require('./filesRegistration.model'); 

const IMAGE_REGISTRAION_TABLE = "image_registration"; 

const imageRegistrationSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fileId:{
        field: 'file_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: FILES_REGISTRATION_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    imageCredits: {
        field: 'image_credits',
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null
    }
}

class ImageRegistration extends Model {
    static associations(models){ 
        this.belongsTo(models.FilesRegistration, {
            as: 'file',
            foreignKey: 'fileId'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: IMAGE_REGISTRAION_TABLE,
        modelName: 'ImageRegistration',
        timestamps: false
        }    
    }
}

module.exports = { IMAGE_REGISTRAION_TABLE, imageRegistrationSchema, ImageRegistration }