const { Model, DataTypes, Sequelize } = require('sequelize'); 

const { IMAGE_BANNERS_TABLE } = require('./imageBanners.model'); 

const BANNERS_ADMISSIONS_TABLE = "banners_admissions"; 

const BannersAdmissionsSchema = {
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
}

class BannersAdmissions extends Model {
    static associations(models){ 
        this.belongsTo(models.ImageBanners, {
                as: 'imageBanner',
                foreignKey: 'bannerId'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: BANNERS_ADMISSIONS_TABLE,
        modelName: 'BannersAdmissions',
        timestamps: false
        }    
    }
}

module.exports = { BANNERS_ADMISSIONS_TABLE, BannersAdmissionsSchema, BannersAdmissions }