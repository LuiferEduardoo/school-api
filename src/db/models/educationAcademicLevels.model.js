const { Model, DataTypes, Sequelize } = require('sequelize'); 

const EDUCATION_DAY_ACADEMIC_LEVELS_TABLE = "education_day_academic_levels"; 

const educationDayAcademiclevels = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    educationDay:{
        allowNull: false,
        type: DataTypes.TEXT
    }
}

class EducationDayAcademicLevels extends Model {
    static associate(models){ 
        this.hasMany(models.AcademicLevels, {
            as: 'academicLevel',
            foreignKey: 'educationDayId'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: EDUCATION_DAY_ACADEMIC_LEVELS_TABLE,
        modelName: 'EducationDayAcademicLevels',
        timestamps: false
        }    
    }
}

module.exports = { EDUCATION_DAY_ACADEMIC_LEVELS_TABLE, educationDayAcademiclevels, EducationDayAcademicLevels }