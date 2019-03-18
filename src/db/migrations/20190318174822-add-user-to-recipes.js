"use strict";

 module.exports = {
   up: (queryInterface, Sequelize) => {

     return queryInterface.addColumn(
       "Recipes",
       "userId",
       {
         type: Sequelize.INTEGER,
         onDelete: "CASCADE",
         allowNull: false,
         references: {
           model: "Users",
           key: "id",
           as: "userId"
         },
       }
     );
   },

   down: (queryInterface, Sequelize) => {
     return queryInterface.removeColumn("Recipes", "userId");
   }
 };