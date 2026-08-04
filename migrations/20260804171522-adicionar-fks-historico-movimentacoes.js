'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint('historico_movimentacoes', {
      fields: ['equip_recip_id'],
      type: 'foreign key',
      name: 'fk_historico_equip_recip',
      references: {
        table: 'equip_recip',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addConstraint('historico_movimentacoes', {
      fields: ['usuario_id'],
      type: 'foreign key',
      name: 'fk_historico_usuario',
      references: {
        table: 'usuarios',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('historico_movimentacoes', {
      fields: ['produto_id'],
      type: 'foreign key',
      name: 'fk_historico_produto',
      references: {
        table: 'produtos',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addConstraint('historico_movimentacoes', {
      fields: ['cliente_id'],
      type: 'foreign key',
      name: 'fk_historico_cliente',
      references: {
        table: 'clientes',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('historico_movimentacoes', {
      fields: ['itm_sep_id'],
      type: 'foreign key',
      name: 'fk_historico_item_sep',
      references: {
        table: 'itens_pedido',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('historico_movimentacoes', {
      fields: ['itm_entr_id'],
      type: 'foreign key',
      name: 'fk_historico_item_entr',
      references: {
        table: 'itens_pedido',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('historico_movimentacoes', {
      fields: ['itm_conc_id'],
      type: 'foreign key',
      name: 'fk_historico_item_conc',
      references: {
        table: 'itens_pedido',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint(
      'historico_movimentacoes',
      'fk_historico_item_conc'
    );

    await queryInterface.removeConstraint(
      'historico_movimentacoes',
      'fk_historico_item_entr'
    );

    await queryInterface.removeConstraint(
      'historico_movimentacoes',
      'fk_historico_item_sep'
    );

    await queryInterface.removeConstraint(
      'historico_movimentacoes',
      'fk_historico_cliente'
    );

    await queryInterface.removeConstraint(
      'historico_movimentacoes',
      'fk_historico_produto'
    );

    await queryInterface.removeConstraint(
      'historico_movimentacoes',
      'fk_historico_usuario'
    );

    await queryInterface.removeConstraint(
      'historico_movimentacoes',
      'fk_historico_equip_recip'
    );
  }
};