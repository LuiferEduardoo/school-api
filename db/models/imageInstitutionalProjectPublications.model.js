const { Model, DataTypes, Sequelize } = require('sequelize'); 

const { IMAGE_REGISTRAION_TABLE } = require('./imageRegistration.model'); 
const { INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE } = require('./institutionalProjectsPublications.model')

const IMAGE_INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE = "image_institutional_projects_publications"; 

const imageInstitutionaProjectsPublicationsSchema = {
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
    institutionalProjectsPublicationsId:{
        field: 'projects_institutional_publications_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE ,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    }
}

class ImageInstitutionalProjectsPublications extends Model {
    static associate(models){ 
        this.belongsTo(models.ImageRegistration, {
            as: 'image',
            foreignKey: 'imageId'
        });
        this.belongsTo(models.InstitutionalProjectsPublications, {
            as: 'institutionalProjectPublication',
            foreignKey: 'institutionalProjectsPublicationsId'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: IMAGE_INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE,
        modelName: 'ImageInstitutionalProjectsPublications',
        timestamps: false
        }    
    }
}

module.exports = { IMAGE_INSTITUTIONAL_PROJECTS_PUBLICATIONS_TABLE, imageInstitutionaProjectsPublicationsSchema, ImageInstitutionalProjectsPublications }