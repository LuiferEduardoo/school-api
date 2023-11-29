const { Model, DataTypes, Sequelize } = require('sequelize'); 
const { SCHEDULE_DAY_TABLE } = require('./scheduleDay.model');
const { SUBJECT_TABLE } = require('./subject.model');
const { SCHOOL_COURSES_TABLE } = require('./schoolCourses.model')

const SCHUDULE_TABLE = "schedule"; 

const SchuduleSchema = {
    id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    subjectId: {
        field: 'subject_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: SUBJECT_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    },
    schoolCoursesId: {
        field: 'school_course_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: SCHOOL_COURSES_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    },
    dayWeekId: {
        field: 'day_week_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: SCHEDULE_DAY_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    },
    startTime: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'start_time',
    },
    endTime: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'end_time',
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

class Schedule extends Model {
    static associate(models){
        this.belongsTo(models.Subject, {
            as: 'subject',
            foreignKey: 'subjectId'
        });
        this.belongsTo(models.SchoolCourses, {
            as: 'schoolCourses',
            foreignKey: 'schoolCoursesId'
        });
        this.belongsTo(models.ScheduleDay, {
            as: 'dayWeek',
            foreignKey: 'dayWeekId'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: SCHUDULE_TABLE,
        modelName: 'Schedule',
        timestamps: false
        }    
    }
}

module.exports = { SCHUDULE_TABLE, SchuduleSchema, Schedule }