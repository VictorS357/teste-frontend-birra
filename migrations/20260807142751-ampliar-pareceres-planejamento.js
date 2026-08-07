'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'planejamento',
      'parecer_do_responsavel',
      {
        type: Sequelize.TEXT,
        allowNull: true
      }
    );

    await queryInterface.changeColumn(
      'planejamento',
      'parecer_do_cliente',
      {
        type: Sequelize.TEXT,
        allowNull: true
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'planejamento',
      'parecer_do_responsavel',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    );

    await queryInterface.changeColumn(
      'planejamento',
      'parecer_do_cliente',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    );
  }
};