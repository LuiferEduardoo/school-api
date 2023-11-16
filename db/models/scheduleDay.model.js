const { Model, DataTypes, Sequelize } = require('sequelize'); 

const SCHEDULE_DAY_TABLE = "schedule_day"; 

const ScheduleDaySchema = {
    id: {
        allowNull: false,
        autoIncrement: true, 
        primaryKey: true,
        type: DataTypes.INTEGER
    },
    dayweek: {
        allowNull: false,
        type: DataTypes.TEXT,
        field: 'day_week',
    }
}

class ScheduleDay extends Model {
    static associations(models){ 
        this.hasMany(models.Schedule, {
            as: 'schule',
            foreignKey: 'dayWeekId',
        });
    }
    static config(sequelize){
        return {
        sequelize,
        tableName: SCHEDULE_DAY_TABLE,
        modelName: 'ScheduleDay',
        timestamps: false
        }    
    }
}

module.exports = { SCHEDULE_DAY_TABLE, ScheduleDaySchema, ScheduleDay }