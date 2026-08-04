'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint('rotas_de_chopeira_filho', {
      fields: ['rota_pai_id'],
      type: 'foreign key',
      name: 'fk_rotas_chopeira_filho_rota_pai',
      references: {
        table: 'rotas_de_chopeira_pai',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('rotas_de_chopeira_filho', {
      fields: ['pedido_id'],
      type: 'foreign key',
      name: 'fk_rotas_chopeira_filho_pedido',
      references: {
        table: 'pedidos',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint(
      'rotas_de_chopeira_filho',
      'fk_rotas_chopeira_filho_pedido'
    );

    await queryInterface.removeConstraint(
      'rotas_de_chopeira_filho',
      'fk_rotas_chopeira_filho_rota_pai'
    );
  }
};