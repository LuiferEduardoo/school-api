const { Model, DataTypes, Sequelize } = require('sequelize'); 
const { SUBJECT_NAME_TABLE } = require('./subjectName.model');
const { USER_TABLE } = require('./user.model');
const { ACADEMIC_LEVELS_TABLE } = require('./academicLevels.model')

const SUBJECT_TABLE = "subject"; 

const SubjectSchema = {
    id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    subjectNameId: {
        field: 'subject_name_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: SUBJECT_NAME_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    academicLevelId: {
        field: 'academic_level_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: ACADEMIC_LEVELS_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    teacherId: {
        field: 'teacher_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: USER_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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

class Subject extends Model {
    static associate(models){
        this.belongsTo(models.SubjectName, {
            as: 'subjectName',
            foreignKey: 'subjectNameId'
        });
        this.belongsTo(models.User, {
            as: 'teacher',
            foreignKey: 'teacherId'
        });
        this.belongsTo(models.AcademicLevels, {
            as: 'academicLevel',
            foreignKey: 'academicLevelId',
        });
        this.hasMany(models.Schedule, {
            as: 'schule',
            foreignKey: 'subjectId',
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: SUBJECT_TABLE,
        modelName: 'Subject',
        timestamps: true
        }    
    }
}

module.exports = { SUBJECT_TABLE, SubjectSchema, Subject }