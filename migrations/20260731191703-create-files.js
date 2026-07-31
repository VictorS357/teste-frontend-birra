'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('files', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
      },

      path: {
        type: Sequelize.STRING,
        allowNull: true
      },

      file: {
        type: Sequelize.STRING,
        allowNull: true
      },

      create_time: {
        type: Sequelize.DATE,
        allowNull: false
      },

      last_modified_by: {
        type: Sequelize.STRING,
        allowNull: false
      },

      mime_type: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('files');
  }
};