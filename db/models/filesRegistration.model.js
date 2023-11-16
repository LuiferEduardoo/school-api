const { Model, DataTypes, Sequelize } = require('sequelize'); 
const { ROL_USER_TABLE } = require('./rolUser.model');

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
            model: ROL_USER_TABLE,
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
        field: 'create_at',
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
    static associations(models){ 
        this.belongsTo(models.RolUser, {
            as: 'user',
            foreignKey: 'userId'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: FILES_REGISTRATION_TABLE,
        modelName: 'FilesRegistration',
        timestamps: false
        }    
    }
}

module.exports = { FILES_REGISTRATION_TABLE, filesRegistrationSchema, FilesRegistration }