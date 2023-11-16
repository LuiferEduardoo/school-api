const { Model, DataTypes, Sequelize } = require('sequelize'); 

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
    }
}

class SchoolGrade extends Model {
    static associations(models){ 
        this.hasMany(models.SchoolCourses, {
            as: 'schoolCourses',
            foreignKey: 'schoolGradeId',
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