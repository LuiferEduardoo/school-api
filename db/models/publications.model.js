const { Model, DataTypes, Sequelize } = require('sequelize');

const PUBLICATIONS_TABLE = "publications"; 

const PublicationsSchema = {
    id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    title: {
        allowNull: false,
        type: DataTypes.TEXT,
    },
    content: {
        allowNull: false,
        type: DataTypes.TEXT,
    },
    link: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
    },
    reading_time: {
        allowNull: false,
        type: DataTypes.TIME
    },
    important: {
        defaultValue: false,
        type: DataTypes.BOOLEAN
    },
    visible: {
        defaultValue: true,
        type: DataTypes.BOOLEAN
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'updated_at',
        defaultValue: Sequelize.NOW
    }
}

class Publications extends Model {
    static associate(models){ 
        this.hasMany(models.CategoriesPublications, {
            as: 'categories',
            foreignKey: 'publicationId',
        });
        this.hasMany(models.SubcategoriesPublications, {
            as: 'subcategories',
            foreignKey: 'publicationId',
        });
        this.hasMany(models.TagsPublications, {
            as: 'tags',
            foreignKey: 'publicationId',
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: PUBLICATIONS_TABLE,
        modelName: 'Publications',
        timestamps: false
        }    
    }
}

module.exports = { PUBLICATIONS_TABLE, PublicationsSchema, Publications }