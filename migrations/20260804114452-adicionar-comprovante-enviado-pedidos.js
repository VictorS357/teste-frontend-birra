'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('pedidos', 'comprovante_enviado', {
      type: Sequelize.BOOLEAN,
      allowNull: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('pedidos', 'comprovante_enviado');
  }
};