'use strict';
module.exports = (sequelize, DataTypes) => {
    var Follow = sequelize.define('Follow', {}, {});
    Follow.associate = function (models) {
        models.User.belongsToMany(models.User, { as: 'follower', through: Follow, foreignKey: 'userId', otherKey: 'followerId' });
        models.User.belongsToMany(models.User, { as: 'user', through: Follow, foreignKey: 'followerId', otherKey: 'userId' });
    };
    return Follow;
};