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
        facebookProviderId: {
            type: DataTypes.STRING
        },
        facebookProviderToken: {
            type: DataTypes.STRING
        }
    }, {});
    User.associate = function(models) {
        // associations can be defined here
    };
    return User;
};