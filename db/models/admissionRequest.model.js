const { Model, DataTypes, Sequelize } = require('sequelize'); 

const { ACADEMIC_LEVELS_TABLE } = require('./academicLevels.model');
const { SCHOOL_GRADE_TABLE } = require('./schoolGrade.model')

const ADMINISTRATION_REQUEST_TABLE = "administration_request"; 

const admissionRequestSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    academicLevel:{
        field: 'academic_level',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: ACADEMIC_LEVELS_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    grade: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: SCHOOL_GRADE_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    birthdate: {
        allowNull: false,
        type: DataTypes.DATE,
    },
    gender: {
        allowNull: false,
        type: DataTypes.TEXT,
    },
    documentType: {
        type: DataTypes.TEXT,
        field: 'document_tipe',
        allowNull: false,
    },
    numberDocument: {
        type: DataTypes.TEXT,
        field: 'number_document',
        allowNull: false,
    },
    phoneNumber: {
        type: DataTypes.STRING(10),
        field: 'phone_number',
        allowNull: false,
    },
    email: {
        type: DataTypes.TEXT, 
        allowNull: false,
    },
    status: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: 'En revisión'
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

class AdmissionRequest extends Model {
    static associate(models){ 
        this.belongsTo(models.AcademicLevels, {
            as: 'academicLevels',
            foreignKey: 'academicLevel'
        });
        this.belongsTo(models.SchoolGrade, {
            as: 'schoolGrade',
            foreignKey: 'grade'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: ADMINISTRATION_REQUEST_TABLE,
        modelName: 'AdmissionRequest',
        timestamps: true
        }    
    }
}

module.exports = { ADMINISTRATION_REQUEST_TABLE, admissionRequestSchema, AdmissionRequest }