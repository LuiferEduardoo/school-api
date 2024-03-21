'use strict';

const { USER_TABLE } = require('../models/user.model');
const { ROL_TABLE } = require('../models/rol.model');
const { ROL_USER_TABLE } = require('../models/rolUser.model');

const bcrypt = require('bcrypt');
const { config } = require('./../../config/config');

module.exports = {
  async up(queryInterface, Sequelize) {
    let transaction;

    try {
      // Iniciar una transacción
      transaction = await queryInterface.sequelize.transaction();

      // Insertar usuario
      const hashedPassword = await bcrypt.hash(config.defaultUserPassword, 10);
      const users = await queryInterface.bulkInsert(
        USER_TABLE,
        [{
          name: config.defaultUserName,
          last_name: config.defaultUserLastName,
          username: config.defaultUserUserUsername,
          email: config.defaultUserEmail,
          password: hashedPassword
        }],
        { transaction, returning: true }
      );

      const user = users[0];

      // Insertar rol
      const roles = await queryInterface.bulkInsert(
        ROL_TABLE,
        [{ rol: 'administrador' }],
        { transaction, returning: true }
      );

      const rol = roles[0];

      // Insertar asociación de rol a usuario
      await queryInterface.bulkInsert(
        ROL_USER_TABLE,
        [{ user_id: user.id, rol_id: rol.id }],
        { transaction }
      );

      // Commit de la transacción
      await transaction.commit();
    } catch (error) {
      // Rollback si hay un error
      if (transaction) await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    // Aquí deberías escribir los comandos para revertir la migración si es necesario
    // Por ejemplo, eliminar los registros que agregaste en el método "up"
  }
};