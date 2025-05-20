const { Model, DataTypes, Sequelize } = require('sequelize'); 

const { IMAGE_BANNERS_TABLE } = require('./imageBanners.model'); 

const BANNERS_OUR_SCHOOL_TABLE = "image_our_school"; 

const BannersOurSchoolSchema = {
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
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    },
    description: {
        type: DataTypes.TEXT, 
        allowNull: true,
    }
}

class BannersOurSchool extends Model {
    static associate(models){ 
        this.belongsTo(models.ImageBanners, {
            as: 'imageBanner',
            foreignKey: 'bannerId'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: BANNERS_OUR_SCHOOL_TABLE,
        modelName: 'BannersOurSchool',
        timestamps: false
        }    
    }
}

module.exports = { BANNERS_OUR_SCHOOL_TABLE, BannersOurSchoolSchema, BannersOurSchool }