'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('equip_recip', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },

      identificador: {
        type: Sequelize.STRING,
        allowNull: false
      },

      tipo: {
        type: Sequelize.STRING,
        allowNull: false
      },

      capacidade: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      qrcode: {
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

      status: {
        type: Sequelize.STRING,
        allowNull: true
      },

      produto_id: {
        type: Sequelize.UUID,
        allowNull: true
      },

      item_pedido_sep_id: {
        type: Sequelize.UUID,
        allowNull: true
      },

      descricao: {
        type: Sequelize.STRING,
        allowNull: true
      },

      item_pedido_entr_id: {
        type: Sequelize.UUID,
        allowNull: true
      },

      aux_pdf: {
        type: Sequelize.DATE,
        allowNull: true
      },

      produto_atual_id: {
        type: Sequelize.UUID,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('equip_recip');
  }
};