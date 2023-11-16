const { Model, DataTypes, Sequelize } = require('sequelize'); 

const USER_TABLE = "user"; 

const UserSchema = {
    id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    username: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
    },
    email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING
    },
    active: {
        defaultValue: true,
        type: DataTypes.BOOLEAN
    },
    online: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
    },
    last_active: {
        allowNull: true,
        type: DataTypes.DATE
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

class User extends Model {
    static associations(){ 

    }
    static config(sequelize){
        return {
        sequelize,
        tableName: USER_TABLE,
        modelName: 'User',
        timestamps: false
        }    
    }
}

module.exports = { USER_TABLE, UserSchema, User }