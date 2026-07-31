'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('imagens_acoes', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },

      descricao: {
        type: Sequelize.STRING,
        allowNull: true
      },

      acao_id: {
        type: Sequelize.UUID,
        allowNull: true
      },

      img: {
        type: Sequelize.STRING,
        allowNull: true
      },

      responsavel_id: {
        type: Sequelize.UUID,
        allowNull: true
      },

      data_e_hora: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('imagens_acoes');
  }
};