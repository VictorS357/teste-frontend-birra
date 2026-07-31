'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },

      nome: {
        type: Sequelize.STRING,
        allowNull: true
      },

      email: {
        type: Sequelize.STRING,
        allowNull: true
      },

      tipo: {
        type: Sequelize.STRING,
        allowNull: true
      },

      foto: {
        type: Sequelize.STRING,
        allowNull: true
      },

      tela_inicial: {
        type: Sequelize.STRING,
        allowNull: true
      },

      data_inicio: {
        type: Sequelize.STRING,
        allowNull: true
      },

      data_fim: {
        type: Sequelize.DATEONLY,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('usuarios');
  }
};
