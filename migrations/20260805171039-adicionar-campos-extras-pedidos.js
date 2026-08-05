'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'pedidos',
      'identificador',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    );

    await queryInterface.addColumn(
      'pedidos',
      'ult_not',
      {
        type: Sequelize.DATE,
        allowNull: true
      }
    );

    await queryInterface.addColumn(
      'pedidos',
      'revenda',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }
    );

    await queryInterface.addColumn(
      'pedidos',
      'foto_copo_entrega',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    );

    await queryInterface.addColumn(
      'pedidos',
      'foto_copo_coleta',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      'pedidos',
      'foto_copo_coleta'
    );

    await queryInterface.removeColumn(
      'pedidos',
      'foto_copo_entrega'
    );

    await queryInterface.removeColumn(
      'pedidos',
      'revenda'
    );

    await queryInterface.removeColumn(
      'pedidos',
      'ult_not'
    );

    await queryInterface.removeColumn(
      'pedidos',
      'identificador'
    );
  }
};