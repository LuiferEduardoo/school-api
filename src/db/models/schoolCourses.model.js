const { Model, DataTypes, Sequelize } = require('sequelize'); 
const { SCHOOL_GRADE_TABLE } = require('./schoolGrade.model');

const SCHOOL_COURSES_TABLE = "school_courses"; 

const schoolCoursesSchema = {
    id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    schoolGradeId: {
        field: 'school_grade_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: SCHOOL_GRADE_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    },
    course: {
        allowNull: false,
        type: DataTypes.INTEGER,
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

class SchoolCourses extends Model {
    static associate(models){ 
        this.belongsTo(models.SchoolGrade, {
            as: 'schoolGrade',
            foreignKey: 'schoolGradeId'
        });
        this.hasMany(models.Schedule, {
            as: 'schule',
            foreignKey: 'schoolCoursesId',
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: SCHOOL_COURSES_TABLE,
        modelName: 'SchoolCourses',
        timestamps: true
        }    
    }
}

module.exports = { SCHOOL_COURSES_TABLE, schoolCoursesSchema, SchoolCourses }