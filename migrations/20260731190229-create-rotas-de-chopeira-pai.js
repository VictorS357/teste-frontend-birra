'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rotas_de_chopeira_pai', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },

      cor: {
        type: Sequelize.STRING,
        allowNull: true
      },

      resp_id: {
        type: Sequelize.UUID,
        allowNull: true
      },

      data: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      status: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('rotas_de_chopeira_pai');
  }
};
