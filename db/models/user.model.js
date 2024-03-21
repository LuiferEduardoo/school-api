const { Model, DataTypes, Sequelize } = require('sequelize');
const bcrypt = require('bcrypt'); 

const USER_TABLE = "user"; 

const UserSchema = {
    id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    lastName: {
        field: 'last_name',
        allowNull: false,
        type: DataTypes.STRING,
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
    recoveryToken: {
        allowNull: true,
        field: 'recovery_token',
        type: DataTypes.STRING
    },
    lastOnline: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'last_online',
    },
    createdAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'updated_at',
        defaultValue: Sequelize.NOW
    }
}

class User extends Model {
    static associate(models){ 
        this.belongsToMany(models.Rol, {
            through: 'RolUser',
            foreignKey: 'userId',
            as: 'rol',
        });
        this.hasMany(models.ImageUser, {
            as: 'image',
            foreignKey: 'userId',
        });
        this.hasMany(models.FilesRegistration, {
            as: 'filesRegistration',
            foreignKey: 'userId',
        });
        this.hasMany(models.NewsPublications, {
            as: 'newsPublications',
            foreignKey: 'userId',
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
        tableName: USER_TABLE,
        modelName: 'User',
        timestamps: true,
        hooks: {
            beforeCreate: async (user, options) => {
                const password = await bcrypt.hash(user.password, 10);
                user.password = password;
            },
            beforeUpdate: async (user, options) => {
                if (user.changed('password')) {
                    const password = await bcrypt.hash(user.password, 10);
                    user.password = password;
                }
            }
            }
        };    
    }
}

module.exports = { USER_TABLE, UserSchema, User }