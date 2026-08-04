'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.addConstraint('imagens_acoes', {
      fields: ['acao_id'],
      type: 'foreign key',
      name: 'fk_imagens_acoes_acao',
      references: {
        table: 'planejamento',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete:'CASCADE'
    });

    await queryInterface.addConstraint('imagens_acoes', {
      fields: ['responsavel_id'],
      type: 'foreign key',
      name: 'fk_imagens_acoes_responsavel',
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
      'imagens_acoes',
      'fk_imagens_acoes_responsavel'
    );

    await queryInterface.removeConstraint(
      'imagens_acoes',
      'fk_imagens_acoes_acao'
    );
  }
};
