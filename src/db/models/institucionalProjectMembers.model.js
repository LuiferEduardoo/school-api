const { Model, DataTypes, Sequelize } = require('sequelize');
const { USER_TABLE } = require('./user.model');
const { INSTITUTIONAL_PROJECTS_TABLE } = require('./institutionalProjects.model')

const INSTITUTIONAL_PROJECTS_MEMBERS_TABLE = "institutional_projects_members"; 

const InstitutionalProjectsMemberSchema = {
    id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    institutionalProjectsId: {
        field: 'institutional_projects_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: INSTITUTIONAL_PROJECTS_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    },
    userId:{
        field: 'user_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: USER_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    },
    isCoordinator:{
        field: 'is_coordinator',
        allowNull: true,
        type: DataTypes.BOOLEAN,    
        defaultValue: false
    }
}

class InstitutionalProjectsMember extends Model {
    static associate(models){ 
        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId'
        });
        this.belongsTo(models.InstitutionalProjects, {
            as: 'institutionalProjects',
            foreignKey: 'institutionalProjectsId'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: INSTITUTIONAL_PROJECTS_MEMBERS_TABLE,
        modelName: 'InstitutionalProjectsMember',
        timestamps: false
        }    
    }
}

module.exports = { INSTITUTIONAL_PROJECTS_MEMBERS_TABLE, InstitutionalProjectsMemberSchema, InstitutionalProjectsMember }