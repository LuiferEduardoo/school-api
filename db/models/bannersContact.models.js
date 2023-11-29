const { Model, DataTypes, Sequelize } = require('sequelize'); 

const { IMAGE_BANNERS_TABLE } = require('./imageBanners.model'); 

const BANNERS_CONTACT_TABLE = "banners_contact"; 

const BannersContactSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    bannerId:{
        field: 'banner_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: IMAGE_BANNERS_TABLE,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    },
    description: {
        type: DataTypes.TEXT, 
        allowNull: true,
    }
}

class BannersContact extends Model {
    static associate(models){ 
        this.belongsTo(models.ImageBanners, {
            as: 'imageBanner',
            foreignKey: 'bannerId'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: BANNERS_CONTACT_TABLE,
        modelName: 'BannersContact',
        timestamps: false
        }    
    }
}

module.exports = { BANNERS_CONTACT_TABLE, BannersContactSchema, BannersContact }