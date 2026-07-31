'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('itens_pedido', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },

      identificador: {
        type: Sequelize.STRING,
        allowNull: true
      },

      pedido_id: {
        type: Sequelize.UUID,
        allowNull: false
      },

      produto_id: {
        type: Sequelize.UUID,
        allowNull: false
      },

      qtde: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      valor_unit: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      ajuste: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },

      ajuste2: {
        type: Sequelize.STRING,
        allowNull: true
      },

      valor_total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },

      obs: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      bonificacao: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },

      volumes: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      liberado: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },

      sobra: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },

      entregue: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },

      concluido: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('itens_pedido');
  }
};