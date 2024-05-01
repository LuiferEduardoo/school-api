const { Model, DataTypes, Sequelize } = require('sequelize'); 
const { USER_TABLE } = require('./user.model');

const FILES_REGISTRATION_TABLE = "files_registration"; 

const filesRegistrationSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    ext: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    fileType: {
        field: 'file_type',
        type: DataTypes.TEXT,
        allowNull: false,
    },
    width: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    height: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    folder: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    isPublic: {
        field: 'is_public',
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
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
    removedAt: {
        type: DataTypes.DATE,
        field: 'removed_at',
        defaultValue: null
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

class FilesRegistration extends Model {
    static associate(models){ 
        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId'
        });
        this.hasMany(models.ImageRegistration, {
            as: 'image',
            foreignKey: 'fileId',
        });
        this.hasMany(models.DocumentRegistration, {
            as: 'document',
            foreignKey: 'fileId',
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: FILES_REGISTRATION_TABLE,
        modelName: 'FilesRegistration',
        timestamps: true,
        }    
    }
}

module.exports = { FILES_REGISTRATION_TABLE, filesRegistrationSchema, FilesRegistration }