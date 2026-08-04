'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.addConstraint('itens_pedido', {
      fields: ['pedido_id'],
      type: 'foreign key',
      name: 'fk_itens_pedido_pedido',
      references: {
        table: 'pedidos',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('itens_pedido', {
      fields: ['produto_id'],
      type: 'foreign key',
      name: 'fk_itens_pedido_produto',
      references: {
        table: 'produtos',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  },

  async down (queryInterface) {
    await queryInterface.removeConstraint(
      'itens_pedido',
      'fk_itens_pedido_produto'
    );

    await queryInterface.removeConstraint(
      'itens_pedido',
      'fk_itens_pedido_pedido'
    )
  }
};
