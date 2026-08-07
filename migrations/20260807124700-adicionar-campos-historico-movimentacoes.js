'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'historico_movimentacoes',
      'movimentar_de',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    );

    await queryInterface.addColumn(
      'historico_movimentacoes',
      'classe',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    );

    await queryInterface.addColumn(
      'historico_movimentacoes',
      'doc',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    );

    await queryInterface.addColumn(
      'historico_movimentacoes',
      'poss',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      'historico_movimentacoes',
      'poss'
    );

    await queryInterface.removeColumn(
      'historico_movimentacoes',
      'doc'
    );

    await queryInterface.removeColumn(
      'historico_movimentacoes',
      'classe'
    );

    await queryInterface.removeColumn(
      'historico_movimentacoes',
      'movimentar_de'
    );
  }
};