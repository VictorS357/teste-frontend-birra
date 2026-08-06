'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      'equip_recip',
      'fk_equip_recip_produto_atual'
    );

    await queryInterface.removeColumn(
      'equip_recip',
      'produto_atual_id'
    );

    await queryInterface.addColumn(
      'equip_recip',
      'produto_atual',
      {
        type: Sequelize.STRING,
        allowNull: true
      }
    );

    await queryInterface.addColumn(
      'equip_recip',
      'cliente_id',
      {
        type: Sequelize.UUID,
        allowNull: false
      }
    );

    await queryInterface.addColumn(
      'equip_recip',
      'ult_mov',
      {
        type: Sequelize.DATEONLY,
        allowNull: true
      }
    );

    await queryInterface.addConstraint('equip_recip', {
      fields: ['cliente_id'],
      type: 'foreign key',
      name: 'fk_equip_recip_cliente',
      references: {
        table: 'clientes',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      'equip_recip',
      'fk_equip_recip_cliente'
    );

    await queryInterface.removeColumn(
      'equip_recip',
      'ult_mov'
    );

    await queryInterface.removeColumn(
      'equip_recip',
      'cliente_id'
    );

    await queryInterface.removeColumn(
      'equip_recip',
      'produto_atual'
    );

    await queryInterface.addColumn(
      'equip_recip',
      'produto_atual_id',
      {
        type: Sequelize.UUID,
        allowNull: true
      }
    );

    await queryInterface.addConstraint('equip_recip', {
      fields: ['produto_atual_id'],
      type: 'foreign key',
      name: 'fk_equip_recip_produto_atual',
      references: {
        table: 'produtos',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  }
};