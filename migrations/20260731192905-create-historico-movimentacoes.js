'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('historico_movimentacoes', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },

      equip_recip_id: {
        type: Sequelize.UUID,
        allowNull: false
      },

      data: {
        type: Sequelize.DATE,
        allowNull: false
      },

      tipo: {
        type: Sequelize.STRING,
        allowNull: true
      },

      descricao: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      usuario_id: {
        type: Sequelize.UUID,
        allowNull: true
      },

      qtde: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
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
      },

      movimentar_para: {
        type: Sequelize.STRING,
        allowNull: true
      },

      itm_sep_id: {
        type: Sequelize.UUID,
        allowNull: true
      },

      itm_entr_id: {
        type: Sequelize.UUID,
        allowNull: true
      },

      itm_conc_id: {
        type: Sequelize.UUID,
        allowNull: true
      },

      nivel: {
        type: Sequelize.STRING,
        allowNull: true
      },

      cliente_id: {
        type: Sequelize.UUID,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('historico_movimentacoes');
  }
};