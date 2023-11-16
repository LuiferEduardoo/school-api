const { Model, DataTypes, Sequelize } = require('sequelize'); 

const { IMAGE_REGISTRAION_TABLE } = require('./imageRegistration.model'); 
const { ROL_USER_TABLE } = require('./rolUser.model');

const IMAGE_BANNERS_TABLE = "image_banners"; 

const imageBannersSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    imageId:{
        field: 'image_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: IMAGE_REGISTRAION_TABLE,
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
            model: ROL_USER_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    }
}

class ImageBanners extends Model {
    static associations(models){ 
        this.belongsTo(models.ImageRegistration, {
            as: 'image',
            foreignKey: 'imageId'
        });
        this.belongsTo(models.RolUser, {
            as: 'user',
            foreignKey: 'userId'
        });
        this.hasMany(models.BannersHome, {
            as: 'bannersHome',
            foreignKey: 'bannerId',
        });
        this.hasMany(models.BannersOurSchool, {
            as: 'bannersOurSchool',
            foreignKey: 'bannerId',
        });
        this.hasMany(models.BannersInstitutionalProjects, {
            as: 'bannersInstitutionalProjects',
            foreignKey: 'bannerId',
        });
        this.hasMany(models.BannersNews, {
            as: 'bannersNews',
            foreignKey: 'bannerId',
        });
        this.hasMany(models.BannersAdmissions, {
            as: 'bannersAdmissions',
            foreignKey: 'bannerId',
        });
        this.hasMany(models.BannersContact, {
            as: 'bannersContact',
            foreignKey: 'bannerId',
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: IMAGE_BANNERS_TABLE,
        modelName: 'ImageBanners',
        timestamps: false
        }    
    }
}

module.exports = { IMAGE_BANNERS_TABLE, imageBannersSchema, ImageBanners }