'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
    */
  await queryInterface.bulkInsert('Comments', [
    {
    comment: 'Upsss Comment',
    UserId: 1,
    PhotoId: 2,
    createdAt: new Date(),
    updatedAt: new Date()
    },
    {
      comment: 'Ssspu Comment',
      UserId: 2,
      PhotoId: 1,
      createdAt: new Date(),
      updatedAt: new Date()  
      }
  ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
