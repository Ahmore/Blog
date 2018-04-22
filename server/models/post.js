'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    text: DataTypes.STRING
  }, {});
  Post.associate = function(models) {
    Post.belongsTo(models.User), {
      foreignKey: 'authorId',
      onDelete: 'CASCADE',
    };
    Post.hasMany(models.Comment, {
      foreignKey: 'postId',
      as: 'comments',
    });
  };
  return Post;
};