'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint('tabela_preco', {
      fields: ['cliente_id'],
      type: 'foreign key',
      name: 'fk_tabela_preco_cliente',
      references: {
        table: 'clientes',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addConstraint('tabela_preco', {
      fields: ['produto_id'],
      type: 'foreign key',
      name: 'fk_tabela_preco_produto',
      references: {
        table: 'produtos',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint(
      'tabela_preco',
      'fk_tabela_preco_produto'
    );

    await queryInterface.removeConstraint(
      'tabela_preco',
      'fk_tabela_preco_cliente'
    );
  }
};