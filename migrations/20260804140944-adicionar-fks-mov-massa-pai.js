'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.addConstraint('mov_massa_pai', {
      fields: ['usuario_id'],
      type: 'foreign key',
      name: 'fk_mov_massa_pai_usuario',
      references: {
        table: 'usuarios',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    await queryInterface.addConstraint('mov_massa_pai', {
      fields: ['produto_id'],
      type: 'foreign key',
      name: 'fk_mov_massa_pai_produto',
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
      'mov_massa_pai',
      'fk_mov_massa_pai_produto'
    );

    await queryInterface.removeConstraint(
      'mov_massa_pai',
      'fk_mov_massa_pai_usuario'
    );
  }
};