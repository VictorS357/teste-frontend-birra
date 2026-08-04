'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('pedidos', {
      fields: ['cliente_id'],
      type: 'foreign key',
      name: 'fk_pedidos_cliente',
      references: {
        table: 'clientes',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addConstraint('pedidos', {
      fields: ['responsavel_id'],
      type: 'foreign key',
      name: 'fk_pedidos_responsavel',
      references: {
        table: 'usuarios',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface) {
    await queryInterface.removeConstraint(
      'pedidos',
      'fk_pedidos_responsavel'
    );

    await queryInterface.removeConstraint(
      'pedidos',
      'fk_pedidos_cliente'
    );
  }
};
