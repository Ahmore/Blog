'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        role: {
            type: DataTypes.ENUM,
            values: ['admin', 'user'],
            allowNull: false,
            defaultValue: 'user'
        },
        facebookProviderId: {
            type: DataTypes.STRING
        },
        facebookProviderToken: {
            type: DataTypes.STRING
        }
    }, {});
    User.associate = function (models) {
        User.hasMany(models.Post, {
            foreignKey: 'authorId',
            as: 'posts',
        });
        User.hasMany(models.Comment, {
            foreignKey: 'authorId',
            as: 'comments',
        });
        User.hasMany(models.Follow, {
            foreignKey: 'followerId',
            as: 'follows',
        });
        User.hasMany(models.Follow, {
            foreignKey: 'userId',
            as: 'followers',
        });
    };
    return User;
};