'use strict';
const faker = require("faker");

let users = [];

for (let i = 1; i <= 60; i++) {
  users.push({
    name: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: new Date(),
    updatedAt: new Date(),

  });
}

module.exports = {
  up: async (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert("Users", users, {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});



  }
};