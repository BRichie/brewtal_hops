'use strict';
module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define('Recipe', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    style: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ingredients: {
      type: DataTypes.STRING,
      allowNull: false
    },

    directions: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Recipe.associate = function (models) {

    Recipe.hasMany(models.Vote, {
      foreignKey: "recipeId",
      as: "votes"
    });

    Recipe.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    })
    Recipe.hasMany(models.Comment, {
      foreignKey: "recipeId",
      as: "comments"
    });
  };
  Recipe.prototype.isOwner = function () {
    return this.userId === this.foreignKey;
  };

  Recipe.prototype.getPoints = function(){

    // #1
        if(this.votes.length === 0) return 0
   
    // #2
        return this.votes
          .map((v) => { return v.value })
          .reduce((prev, next) => { return prev + next });
      };
  return Recipe;
};