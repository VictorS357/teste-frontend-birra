'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.addConstraint('mov_massa_filho',{
      fields: ['mov_massa_pai_id'],
      type: 'foreign key',
      name: 'fk_mov_massa_filho_pai',
      references: {
        table: 'mov_massa_pai',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('mov_massa_filho', {
      fields: ['equip_recip_id'],
      type: 'foreign key',
      name: 'fk_mov_massa_filho_equip_recip',
      references: {
        table: 'equip_recip',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  },

  async down (queryInterface) {
    await queryInterface.removeConstraint(
      'mov_massa_filho',
      'fk_mov_massa_filho_equip_recip'
    );

    await queryInterface.removeConstraint(
      'mov_massa_filho',
      'fk_mov_massa_filho_pai'
    );
  }
};
