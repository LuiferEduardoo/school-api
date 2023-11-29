const { Model, DataTypes, Sequelize } = require('sequelize');

const ACADEMIC_LEVELS_TABLE = "academic_levels"; 

const AcademicLevelsSchema = {
    id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    nameLevel: {
        field: 'name_level',
        allowNull: false,
        type: DataTypes.TEXT,
    },
    description: {
        allowNull: false,
        type: DataTypes.TEXT,
    },
    levelCode: {
        field: 'level_code',
        allowNull: false,
        type: DataTypes.TEXT,
        unique: true,
    },
    campus: {
        allowNull: false,
        type: DataTypes.INTEGER
    },
    modality: {
        allowNull: false,
        type: DataTypes.TEXT,
    },
    educationalObjectives: {
        field: 'educational_objetive',
        allowNull: true,
        type: DataTypes.TEXT,
    },
    admissionRequirements: {
        field: 'admission_requirements',
        allowNull: true,
        type: DataTypes.TEXT,
    },
    visible: {
        defaultValue: true,
        type: DataTypes.BOOLEAN
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

class AcademicLevels extends Model {
    static associate(models){ 
        this.hasMany(models.AdmissionRequest, {
            as: 'admissionRequest',
            foreignKey: 'academicLevel',
        });
        this.hasMany(models.Subject, {
            as: 'subject',
            foreignKey: 'academicLevelId',
        });
        this.hasMany(models.SchoolGrade, {
            as: 'schoolGrade',
            foreignKey: 'academicLevel',
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: ACADEMIC_LEVELS_TABLE,
        modelName: 'AcademicLevels',
        timestamps: false
        }    
    }
}

module.exports = { ACADEMIC_LEVELS_TABLE, AcademicLevelsSchema, AcademicLevels }