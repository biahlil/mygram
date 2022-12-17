'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
    */
   await queryInterface.bulkInsert('Photos', [
    {
     title: 'Photo Jhon Doe',
     caption: 'Photo ini adalah photo selfie jhon',
     poster_image_url: 'http://image.com/photojhon.jpg',
     UserId: 1,
     createdAt: new Date(),
     updatedAt: new Date()
    },
    {
      title: 'Photo Budi Gusti',
      caption: 'Photo ini adalah photo selfie budi',
      poster_image_url: 'http://image.com/photobudi.jpg',
      UserId: 2,
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
