'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('pedidos', 'hora', {
      type: Sequelize.TIME,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('pedidos', 'hora', {
      type: Sequelize.TIME,
      allowNull: false
    });
  }
};