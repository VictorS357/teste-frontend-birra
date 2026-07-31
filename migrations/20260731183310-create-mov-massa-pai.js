'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mov_massa_pai', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },

      usuario_id: {
        type: Sequelize.UUID,
        allowNull: false
      },

      movimentar_para: {
        type: Sequelize.STRING,
        allowNull: false
      },

      timestamp: {
        type: Sequelize.DATE,
        allowNull: true
      },

      tipo: {
        type: Sequelize.STRING,
        allowNull: false
      },

      lote: {
        type: Sequelize.STRING,
        allowNull: true
      },

      validade: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      produto_id: {
        type: Sequelize.UUID,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('mov_massa_pai');
  }
};