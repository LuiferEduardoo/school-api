const { Model, DataTypes, Sequelize } = require('sequelize'); 

const CALENDAR_TABLE = "calendar"; 

const calendarSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    visible: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    startDate: {
        type: DataTypes.DATE,
        field: 'start_date',
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        field: 'end_date',
        allowNull: false,
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

class Calendar extends Model {
    static associate(){ 

    }
    static config(sequelize){
        return {
        sequelize,
        tableName: CALENDAR_TABLE,
        modelName: 'Calendar',
        timestamps: false
        }    
    }
}

module.exports = { CALENDAR_TABLE, calendarSchema, Calendar }