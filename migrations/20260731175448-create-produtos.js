'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('produtos', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },

      descricao: {
        type: Sequelize.STRING,
        allowNull: true
      },

      valor_unit: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },

      obs: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      unidade_medida: {
        type: Sequelize.STRING,
        allowNull: true
      },

      imagem: {
        type: Sequelize.STRING,
        allowNull: true
      },

      retornavel: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },

      estoque: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('produtos');
  }
};
