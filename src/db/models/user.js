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
        isEmail: { msg: "must be a valid email" }
      }
    },    
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "standard"
    }
     }, {});
  
  
    User.associate = function(models) {
      User.hasMany(models.Recipe, {
        foreignKey: "userId",
        as: "recipes"
      });

      User.prototype.isAdmin = function() {
        return this.role === "admin";
      };
      User.prototype.isStandard = function () {
        return this.role === "standard";
      };
  };
  return User;
};