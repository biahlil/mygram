'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
    */
    await queryInterface.bulkInsert('SocialMedia', [
      {
      name: 'John Doe',
      social_media_url: 'http://mygram.com/jhondoe123',
      UserId:1,
      createdAt: new Date(),
      updatedAt: new Date()  
      },
      {
        name: 'Budi Gusti',
        social_media_url: 'http://mygram.com/budigusti123',
        UserId:2,
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
