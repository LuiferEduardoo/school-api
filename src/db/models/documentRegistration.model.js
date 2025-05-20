const { Model, DataTypes, Sequelize } = require('sequelize'); 

const { FILES_REGISTRATION_TABLE } = require('./filesRegistration.model'); 

const DOCUMENT_REGISTRAION_TABLE = "document_registration"; 

const documentRegistrationSchema = {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
        onDelete: 'RESTRICT'
    },
}

class DocumentRegistration extends Model {
    static associate(models){ 
        this.belongsTo(models.FilesRegistration, {
            as: 'file',
            foreignKey: 'fileId'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: DOCUMENT_REGISTRAION_TABLE,
        modelName: 'DocumentRegistration',
        timestamps: false
        }    
    }
}

module.exports = { DOCUMENT_REGISTRAION_TABLE, documentRegistrationSchema, DocumentRegistration }