'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mov_massa_filho', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },

      mov_massa_pai_id: {
        type: Sequelize.UUID,
        allowNull: false
      },

      equip_recip_id: {
        type: Sequelize.UUID,
        allowNull: false
      },

      timestamp: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('mov_massa_filho');
  }
};