const { Model, DataTypes, Sequelize } = require('sequelize'); 
const { SUBJECT_NAME_TABLE } = require('./subjectName.model');
const { ROL_USER_TABLE } = require('./rolUser.model');

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
    teacherId: {
        field: 'teacher_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: ROL_USER_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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

class Subject extends Model {
    static associations(models){
        this.belongsTo(models.SubjectName, {
            as: 'subjectName',
            foreignKey: 'subjectNameId'
        });
        this.belongsTo(models.RolUser, {
            as: 'teacher',
            foreignKey: 'teacherId'
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
        timestamps: false
        }    
    }
}

module.exports = { SUBJECT_TABLE, SubjectSchema, Subject }