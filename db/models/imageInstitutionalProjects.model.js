const { Model, DataTypes, Sequelize } = require('sequelize'); 

const { IMAGE_REGISTRAION_TABLE } = require('./imageRegistration.model'); 
const { INSTITUTIONAL_PROJECTS_TABLE } = require('./institutionalProjects.model')

const IMAGE_INSTITUTIONAL_PROJECTS_TABLE = "image_institutional_projects"; 

const imageInstitutionaProjectsSchema = {
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
    institutionalProjectsId:{
        field: 'projects_institutional_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: INSTITUTIONAL_PROJECTS_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    }
}

class ImageInstitutionalProjects extends Model {
    static associations(models){ 
        this.belongsTo(models.ImageRegistration, {
            as: 'image',
            foreignKey: 'imageId'
        });
        this.belongsTo(models.InstitutionalProjects, {
            as: 'institutionalProjects',
            foreignKey: 'institutionalProjectsId'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: IMAGE_INSTITUTIONAL_PROJECTS_TABLE,
        modelName: 'ImageInstitutionalProjects',
        timestamps: false
        }    
    }
}

module.exports = { IMAGE_INSTITUTIONAL_PROJECTS_TABLE, imageInstitutionaProjectsSchema, ImageInstitutionalProjects }