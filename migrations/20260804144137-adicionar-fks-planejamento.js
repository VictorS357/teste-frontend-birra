'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.addConstraint('planejamento', {
      fields: ['responsavel_id'],
      type: 'foreign key',
      name: 'fk_planejamento_responsavel',
      references: {
        table: 'usuarios',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('planejamento', {
      fields: ['solicitante_id'],
      type: 'foreign key',
      name: 'fk_planejamento_solicitante',
      references: {
        table: 'usuarios',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('planejamento', {
      fields: ['cliente_id'],
      type: 'foreign key',
      name: 'fk_planejamento_cliente',
      references: {
        table: 'clientes',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface) {
    await queryInterface.removeConstraint(
      'planejamento',
      'fk_planejamento_cliente'
    );

    await queryInterface.removeConstraint(
      'planejamento',
      'fk_planejamento_solicitante'
    );

    await queryInterface.removeConstraint(
      'planejamento',
      'fk_planejamento_responsavel'
    );
  }
};
