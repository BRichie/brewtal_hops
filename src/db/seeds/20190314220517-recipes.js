'use strict';

const faker = require("faker");

let recipes = [];

for (let i = 1; i <= 15; i++) {
  recipes.push({
    title: faker.hacker.noun(),
    style: faker.hacker.noun(),
    ingredients: faker.hacker.phrase(),
    directions: faker.hacker.verb(),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 1
  });
}
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Recipes", recipes, {});

  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Recipes", null, {});

  }
};