'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'equip_recip',
      'cliente_id',
      {
        type: Sequelize.UUID,
        allowNull: true
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn(
      'equip_recip',
      'cliente_id',
      {
        type: Sequelize.UUID,
        allowNull: false
      }
    );
  }
};