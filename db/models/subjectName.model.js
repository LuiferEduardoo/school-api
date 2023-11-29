const { Model, DataTypes, Sequelize } = require('sequelize'); 

const SUBJECT_NAME_TABLE = "subject_name"; 

const subjectNameSchema = {
    id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name: {
        allowNull: false,
        type: DataTypes.TEXT,
    }
}

class SubjectName extends Model {
    static associate(){ 

    }
    static config(sequelize){
        return {
        sequelize,
        tableName: SUBJECT_NAME_TABLE,
        modelName: 'SubjectName',
        timestamps: false
        }    
    }
}

module.exports = { SUBJECT_NAME_TABLE, subjectNameSchema, SubjectName }