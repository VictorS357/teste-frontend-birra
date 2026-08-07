'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'historico_movimentacoes',
      'itm_entr',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'historico_movimentacoes',
      'itm_entr',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }
    );
  }
};