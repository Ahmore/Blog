'use strict';
module.exports = (sequelize, DataTypes) => {
    var Comment = sequelize.define('Comment', {
        text: DataTypes.STRING,
    }, {});
    Comment.associate = function(models) {
        Comment.belongsTo(models.Post, {
            foreignKey: 'postId',
            onDelete: 'CASCADE',
        });
        Comment.belongsTo(models.User, {
            foreignKey: 'authorId',
            onDelete: 'CASCADE',
        });
    };
    return Comment;
};
