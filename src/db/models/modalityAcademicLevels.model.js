const { Model, DataTypes, Sequelize } = require('sequelize'); 

const MODALITY_ACADEMIC_LEVELS_TABLE = "modality_academic_levels"; 

const modalityAcademicLevels = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    modality:{
        allowNull: false,
        type: DataTypes.TEXT
    }
}

class ModalityAcademicLevels extends Model {
    static associate(models){ 
        this.hasMany(models.AcademicLevels, {
            as: 'academicLevel',
            foreignKey: 'modalityId'
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: MODALITY_ACADEMIC_LEVELS_TABLE,
        modelName: 'ModalityAcademicLevels',
        timestamps: false
        }    
    }
}

module.exports = { MODALITY_ACADEMIC_LEVELS_TABLE, modalityAcademicLevels, ModalityAcademicLevels }