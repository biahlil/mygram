'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
    */
  await queryInterface.bulkInsert('Users', [
    {
    full_name: 'John Doe',
    email: "john.doe@gmail.com",
    username: 'JohnDoe123',
    password: '123',
    profile_image_url: 'http://img.com/img/jhon.png',
    age: 20,
    phone_number: 2020,
    createdAt: new Date(),
    updatedAt: new Date()
    },
    {
      full_name: 'Budi Gusti',
      email: "budi.gusti@gmail.com",
      username: 'BudiGusti123',
      password: '123',
      profile_image_url: 'http://img.com/img/budi.png',
      age: 20,
      phone_number: 2020,
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
