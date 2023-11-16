const { Model, DataTypes, Sequelize } = require('sequelize'); 

const ADMINISTRATION_REQUEST_TABLE = "administration_request"; 

const admissionRequestSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: DataTypes.TEXT,
        field: 'first_name',
        allowNull: false,
    },
    secondName: {
        type: DataTypes.TEXT,
        field: 'second_name',
        allowNull: false,
    },
    surname: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    secondSurname: {
        type: DataTypes.TEXT,
        field: 'second_surname',
        allowNull: false,
    },
    documentType: {
        type: DataTypes.TEXT,
        field: 'document_tipe',
        allowNull: false,
    },
    numberDocument: {
        type: DataTypes.INTEGER,
        field: 'number_document',
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.INTEGER,
        field: 'phone_number',
        allowNull: false,
    },
    typeEducation: {
        type: DataTypes.TEXT,
        field: 'document_tipe',
        allowNull: false,
    },
    status: {
        allowNull: false,
        type: DataTypes.TEXT,
        defaultValue: 'En espera'
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

class AdmissionRequest extends Model {
    static associations(){ 

    }
    static config(sequelize){
        return {
        sequelize,
        tableName: ADMINISTRATION_REQUEST_TABLE,
        modelName: 'AdmissionRequest',
        timestamps: false
        }    
    }
}

module.exports = { ADMINISTRATION_REQUEST_TABLE, admissionRequestSchema, AdmissionRequest }