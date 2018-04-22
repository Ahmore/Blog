'use strict';
module.exports = (sequelize, DataTypes) => {
  var Follow = sequelize.define('Follow', {}, {});
  Follow.associate = function(models) {
    Follow.belongsTo(models.User, {
      foreignKey: 'followerId',
      onDelete: 'CASCADE',
    });
    Follow.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };
  return Follow;
};