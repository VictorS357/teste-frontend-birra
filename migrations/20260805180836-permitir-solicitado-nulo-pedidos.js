'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('pedidos', 'solicitado', {
      type: Sequelize.DATEONLY,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('pedidos', 'solicitado', {
      type: Sequelize.DATEONLY,
      allowNull: false
    });
  }
};