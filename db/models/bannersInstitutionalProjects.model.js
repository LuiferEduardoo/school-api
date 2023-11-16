const { Model, DataTypes, Sequelize } = require('sequelize'); 

const { IMAGE_BANNERS_TABLE } = require('./imageBanners.model'); 

const BANNERS_INSTITUTIONAL_PROJECTS_TABLE = "banners_institutional_projects"; 

const BannersInstitutionalProjectsSchema = {
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
        onUpdate: 'CASCADE'
    },
}

class BannersInstitutionalProjects extends Model {
    static associations(models){ 
        this.belongsTo(models.ImageBanners, {
            as: 'imageBanners',
            foreignKey: 'bannerId'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: BANNERS_HOME_TABLE,
        modelName: 'BannersHome',
        timestamps: false
        }    
    }
}

module.exports = { BANNERS_INSTITUTIONAL_PROJECTS_TABLE, BannersInstitutionalProjectsSchema, BannersInstitutionalProjects }