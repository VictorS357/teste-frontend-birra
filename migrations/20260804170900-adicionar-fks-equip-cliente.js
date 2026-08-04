'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint('equip_cliente', {
      fields: ['cliente_id'],
      type: 'foreign key',
      name: 'fk_equip_cliente_cliente',
      references: {
        table: 'clientes',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint(
      'equip_cliente',
      'fk_equip_cliente_cliente'
    );
  }
};