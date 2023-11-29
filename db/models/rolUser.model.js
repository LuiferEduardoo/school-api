const { Model, DataTypes, Sequelize } = require('sequelize'); 

const { ROL_TABLE } = require('./rol.model');
const { USER_TABLE } = require('./user.model'); 

const ROL_USER_TABLE = "Rol_user"; 

const RolUserSchema = {
    id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    userId:{
        field: 'user_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        unique: true,
        references: {
            model: USER_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    rolId: {
        field: 'rol_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: ROL_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    }
}

class RolUser extends Model {
    static associate(models){ 
        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId'
        });
        this.belongsTo(models.Rol, {
            as: 'rol',
            foreignKey: 'rolId'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: ROL_USER_TABLE,
        modelName: 'RolUser',
        timestamps: false
        }    
    }
}

module.exports = { ROL_USER_TABLE, RolUserSchema, RolUser }