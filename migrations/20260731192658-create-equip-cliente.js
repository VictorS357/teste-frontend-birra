'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('equip_cliente', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },

      cliente_id: {
        type: Sequelize.UUID,
        allowNull: true
      },

      desc: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      foto: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('equip_cliente');
  }
};