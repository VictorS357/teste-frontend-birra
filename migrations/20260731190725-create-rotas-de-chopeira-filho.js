'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rotas_de_chopeira_filho', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },

      rota_pai_id: {
        type: Sequelize.UUID,
        allowNull: false
      },

      ordem: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      pedido_id: {
        type: Sequelize.UUID,
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('rotas_de_chopeira_filho');
  }
}; 