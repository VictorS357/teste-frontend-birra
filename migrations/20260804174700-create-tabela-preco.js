'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tabela_preco', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },

      identificador: {
        type: Sequelize.STRING,
        allowNull: true
      },

      cliente_id: {
        type: Sequelize.UUID,
        allowNull: false
      },

      produto_id: {
        type: Sequelize.UUID,
        allowNull: false
      },

      preco: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      obs: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tabela_preco');
  }
};