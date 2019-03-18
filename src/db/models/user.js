'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {

    name: {
      allowNull: false,
      type: DataTypes.STRING
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "must be a valid email"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "member"
    }
  }, {});


  User.associate = function (models) {
    
    User.hasMany(models.Recipe, {
      foreignKey: "userId",
      as: "recipes"
    });
    User.hasMany(models.Vote, {
      foreignKey: "userId",
      as: "votes"
    });
    User.hasMany(models.Comment, {
      foreignKey: "userId",
      as: "comments"
    })

    User.prototype.isAdmin = function () {
      return this.role === "admin";
    
    };
  };
  return User;
};