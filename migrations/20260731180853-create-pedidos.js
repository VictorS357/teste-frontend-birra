'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pedidos', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },

      cliente_id: {
        type: Sequelize.UUID,
        allowNull: false
      },

      responsavel_id: {
        type: Sequelize.UUID,
        allowNull: true
      },

      data: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      hora: {
        type: Sequelize.TIME,
        allowNull: false
      },

      taxa_entrega: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      local_cliente: {
        type: Sequelize.STRING,
        allowNull: true
      },

      local_pedido: {
        type: Sequelize.STRING,
        allowNull: true
      },

      obs: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      status: {
        type: Sequelize.STRING,
        allowNull: true
      },

      aux_orc: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      aux_rota: {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      obs_coleta: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      solicitado: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      data_liberacao: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      usuario_liberacao: {
        type: Sequelize.STRING,
        allowNull: true
      },

      data_separacao: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      usuario_separacao: {
        type: Sequelize.STRING,
        allowNull: true
      },

      data_entrega: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      usuario_entrega: {
        type: Sequelize.STRING,
        allowNull: true
      },

      data_conclusao: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      usuario_conclusao: {
        type: Sequelize.STRING,
        allowNull: true
      },

      assinatura: {
        type: Sequelize.STRING,
        allowNull: true
      },

      comprovante_gerado: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },

      coletado_aut: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },

      data_hora_coleta: {
        type: Sequelize.DATE,
        allowNull: true
      },

      foto_gas: {
        type: Sequelize.STRING,
        allowNull: true
      },

      cidade_entrega: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('pedidos');
  }
};
