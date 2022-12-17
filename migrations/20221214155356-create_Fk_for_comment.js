'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('Comments','UserId', { 
      type: Sequelize.INTEGER 
    })
    await queryInterface.addConstraint('Comments', { 
      fields: ['UserId'],
      type: 'foreign key',
      name: 'user_fk',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
    await queryInterface.addColumn('Comments','PhotoId', { 
      type: Sequelize.INTEGER 
    })
    await queryInterface.addConstraint('Comments', { 
      fields: ['PhotoId'],
      type: 'foreign key',
      name: 'photo_fk',
      references: {
        table: 'Photos',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
