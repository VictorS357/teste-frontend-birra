'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('planejamento', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },

      data_solicitacao: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      descricao: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      tipo: {
        type: Sequelize.STRING,
        allowNull: true
      },

      status: {
        type: Sequelize.STRING,
        allowNull: true
      },

      responsavel_id: {
        type: Sequelize.UUID,
        allowNull: true
      },

      urgencia: {
        type: Sequelize.STRING,
        allowNull: true
      },

      parecer_do_responsavel: {
        type: Sequelize.STRING,
        allowNull: true
      },

      prazo_de_conclusao: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      cliente_id: {
        type: Sequelize.UUID,
        allowNull: true
      },

      parecer_do_cliente: {
        type: Sequelize.STRING,
        allowNull: true
      },

      assinatura_do_cliente: {
        type: Sequelize.STRING,
        allowNull: true
      },

      data_de_conclusao: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      solicitante_id: {
        type: Sequelize.UUID,
        allowNull: true
      },

      data_inicio: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      privacidade: {
        type: Sequelize.STRING,
        allowNull: true
      },

      foto: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('planejamento');
  }
};
