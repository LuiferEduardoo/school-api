const { Model, DataTypes, Sequelize } = require('sequelize'); 

const CAMPUS_ACADEMIC_LEVELS_TABLE = "campus_academic_levels"; 

const campusAcademicLevels = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    campus:{
        allowNull: false,
        type: DataTypes.TEXT
    },
    campusNumber:{
        field: 'campus_number',
        allowNull: false,
        type: DataTypes.INTEGER,
    }
}

class CampusAcademicLevels extends Model {
    static associate(models){ 
        this.hasMany(models.AcademicLevels, {
            as: 'academicLevel',
            foreignKey: 'campusId'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: CAMPUS_ACADEMIC_LEVELS_TABLE,
        modelName: 'CampusAcademicLevels',
        timestamps: false
        }    
    }
}

module.exports = { CAMPUS_ACADEMIC_LEVELS_TABLE, campusAcademicLevels, CampusAcademicLevels }