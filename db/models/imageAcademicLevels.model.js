const { Model, DataTypes, Sequelize } = require('sequelize'); 

const { IMAGE_REGISTRAION_TABLE } = require('./imageRegistration.model'); 
const { ACADEMIC_LEVELS_TABLE } = require('./academicLevels.model')

const IMAGE_ACADEMIC_LEVELS_TABLE = "image_academic_levels"; 

const ImageAcademicLevelsSchema = {
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
    academicLevelsId:{
        field: 'academic_levels_id',
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
            model: ACADEMIC_LEVELS_TABLE,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
    }
}

class ImageAcademicLevels extends Model {
    static associate(models){ 
        this.belongsTo(models.ImageRegistration, {
            as: 'image',
            foreignKey: 'imageId'
        });
        this.belongsTo(models.NewsPublications, {
            as: 'academicLevels',
            foreignKey: 'academicLevelsId'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: IMAGE_ACADEMIC_LEVELS_TABLE,
        modelName: 'ImageAcademicLevels',
        timestamps: false
        }    
    }
}

module.exports = { IMAGE_ACADEMIC_LEVELS_TABLE, ImageAcademicLevelsSchema, ImageAcademicLevels }