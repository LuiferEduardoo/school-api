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
    static associations(models){ 
        this.belongsTo(models.User, {
            as: 'user',
            foreignKey: 'userId'
        });
        this.belongsTo(models.Rol, {
            as: 'rol',
            foreignKey: 'rolId'
        });
        this.hasMany(models.FilesRegistration, {
            as: 'filesRegistration',
            foreignKey: 'userId',
        });
        this.hasMany(models.NewsPublications, {
            as: 'newsPublications',
            foreignKey: 'userId',
        });
        this.hasMany(models.InstitutionalProjects, {
            as: 'InstitutionalProjects',
            foreignKey: 'coordinatorId',
        });
        this.hasMany(models.InstitutionalProjectsMember, {
            as: 'InstitutionalProjectsMember',
            foreignKey: 'userId',
        });
        this.hasMany(models.ImageBanners, {
            as: 'imageBanners',
            foreignKey: 'userId',
        });
        this.hasMany(models.Subject, {
            as: 'subject',
            foreignKey: 'teacherId',
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: ROL_TABLE,
        modelName: 'RolUser',
        timestamps: false
        }    
    }
}

module.exports = { ROL_USER_TABLE, RolUserSchema, RolUser }