'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.addConstraint('rotas_de_chopeira_pai', {
      fields: ['resp_id'],
      type: 'foreign key',
      name: 'fk_rotas_chopeira_pai_responsavel',
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
      'rotas_de_chopeira_pai',
      'fk_rotas_chopeira_pai_responsavel'
    );
  }
};
