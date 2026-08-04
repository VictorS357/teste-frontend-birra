'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.addConstraint('equip_recip', {
      fields: ['produto_id'],
      type: 'foreign key',
      name: 'fk_equip_recip_produto',
      references: {
        table: 'produtos',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('equip_recip', {
      fields: ['produto_atual_id'],
      type: 'foreign key',
      name: 'fk_equip_recip_produto_atual',
      references: {
        table: 'produtos',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('equip_recip', {
      fields: ['item_pedido_sep_id'],
      type: 'foreign key',
      name: 'fk_equip_recip_item_pedido_sep',
      references: {
        table: 'itens_pedido',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('equip_recip', {
      fields: ['item_pedido_entr_id'],
      type: 'foreign key',
      name: 'fk_equip_recip_item_pedido_entr',
      references: {
        table: 'itens_pedido',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
  },

  async down (queryInterface) {
    await queryInterface.removeConstraint(
      'equip_recip',
      'fk_equip_recip_item_pedido_entr'
    );

    await queryInterface.removeConstraint(
      'equip_recip',
      'fk_equip_recip_item_pedido_sep'
    );

    await queryInterface.removeConstraint(
      'equip_recip',
      'fk_equip_recip_produto_atual'
    );

    await queryInterface.removeConstraint(
      'equip_recip',
      'fk_equip_recip_produto'
    );
  }
};
