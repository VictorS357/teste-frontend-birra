'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clientes', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },

      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },

      tipo: {
        type: Sequelize.STRING,
        allowNull: false
      },

      razao_social: {
        type: Sequelize.STRING,
        allowNull: true
      },

      cpf_cnpj: {
        type: Sequelize.STRING,
        allowNull: true
      },

      contato: {
        type: Sequelize.STRING,
        allowNull: true
      },

      telefone: {
        type: Sequelize.STRING,
        allowNull: true
      },

      abre: {
        type: Sequelize.TIME,
        allowNull: true
      },

      fecha: {
        type: Sequelize.TIME,
        allowNull: true
      },

      local: {
        type: Sequelize.STRING,
        allowNull: true
      },

      cond_pgto: {
        type: Sequelize.STRING,
        allowNull: true
      },

      obs: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      cidade: {
        type: Sequelize.STRING,
        allowNull: true
      },

      imagem: {
        type: Sequelize.STRING,
        allowNull: true
      },

      ultima_limpeza: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      inadi: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('clientes');
  }
};