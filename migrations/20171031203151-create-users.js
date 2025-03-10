'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.STRING(45),
      },
      format: {
        type: Sequelize.STRING(45),
      },
      language: {
        type: Sequelize.STRING(45),
      },
      teamPartner: {
        type: Sequelize.STRING(45),
      },
      position: {
        type: Sequelize.STRING(45),
      },
      eventId: {
        type: Sequelize.INTEGER,
      },
      roomId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('users');
  }
};
