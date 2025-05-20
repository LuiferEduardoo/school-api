const { Model, DataTypes, Sequelize } = require('sequelize'); 

const ROL_TABLE = "Rol"; 

const RolSchema = {
    id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    rol: {
        allowNull: false,
        type: DataTypes.STRING,
    }
}

class Rol extends Model {
    static associate(models){
        this.belongsToMany(models.User, {
            through: 'RolUser',
            foreignKey: 'rolId',
            as: 'user',
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: ROL_TABLE,
        modelName: 'Rol',
        timestamps: false
        }    
    }
}

module.exports = { ROL_TABLE, RolSchema, Rol }