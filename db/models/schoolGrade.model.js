const { Model, DataTypes, Sequelize } = require('sequelize'); 

const { ACADEMIC_LEVELS_TABLE } = require('./academicLevels.model');

const SCHOOL_GRADE_TABLE = "school_grade"; 

const schoolGradeSchema = {
    id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    grade: {
        allowNull: false,
        type: DataTypes.INTEGER,
        unique: true,
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
}

class SchoolGrade extends Model {
    static associate(models){ 
        this.belongsTo(models.AcademicLevels, {
            as: 'academic',
            foreignKey: 'academicLevel'
        });
        this.hasMany(models.SchoolCourses, {
            as: 'schoolCourses',
            foreignKey: 'schoolGradeId',
        });
        this.hasMany(models.AdmissionRequest, {
            as: 'AdmissionRequest',
            foreignKey: 'grade',
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: SCHOOL_GRADE_TABLE,
        modelName: 'SchoolGrade',
        timestamps: false
        }    
    }
}

module.exports = { SCHOOL_GRADE_TABLE, schoolGradeSchema, SchoolGrade }