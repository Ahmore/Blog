const User = require('../models').User;
const Post = require('../models').Post;
const Comment = require('../models').Comment;
const Follow = require('../models').Follow;
const Sequelize = require('Sequelize');
const errorResponder = require('./../utils/errorResponder');
const successResponder = require('./../utils/successResponder');

const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.json`)[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
    sequelize = new Sequelize(
        config.database, config.username, config.password, config
    );
}

module.exports = {
    getFollows(req, res) {
        return sequelize.query("SELECT COUNT(*) FROM \"Follows\" INNER JOIN \"Users\" ON \"Follows\".\"userId\" = \"Users\".\"id\" WHERE \"Follows\".\"followerId\" = :followerId", { 
            replacements: { 
                followerId: req.auth.id
            },
            type: Sequelize.QueryTypes.SELECT
        })
        .then(data => {
            return sequelize.query("SELECT * FROM \"Follows\" INNER JOIN \"Users\" ON \"Follows\".\"userId\" = \"Users\".\"id\" WHERE \"Follows\".\"followerId\" = :followerId LIMIT :limit OFFSET :offset", { 
                replacements: { 
                    followerId: req.auth.id,
                    offset: req.body.offset || 0,
                    limit: req.body.limit || null
                },
                type: Sequelize.QueryTypes.SELECT
            })
            .then(users => {
                res.status(200).send(successResponder(users, data[0].count));
            })
            .catch((error) => res.status(400).send(errorResponder(error)));
        })
        .catch((error) => res.status(400).send(errorResponder(error)));
    },

    getFollowers(req, res) {
        return sequelize.query("SELECT COUNT(*) FROM \"Follows\" INNER JOIN \"Users\" ON \"Follows\".\"followerId\" = \"Users\".\"id\" WHERE \"Follows\".\"userId\" = :userId", { 
            replacements: { 
                userId: req.auth.id
            },
            type: Sequelize.QueryTypes.SELECT
        })
        .then(data => {
            return sequelize.query("SELECT * FROM \"Follows\" INNER JOIN \"Users\" ON \"Follows\".\"followerId\" = \"Users\".\"id\" WHERE \"Follows\".\"userId\" = :userId LIMIT :limit OFFSET :offset", { 
                replacements: { 
                    userId: req.auth.id,
                    offset: req.body.offset || 0,
                    limit: req.body.limit || null
                },
                type: Sequelize.QueryTypes.SELECT
            })
            .then(users => {
                res.status(200).send(successResponder(users, data[0].count));
            })
            .catch((error) => res.status(400).send(errorResponder(error)));
        })
        .catch((error) => res.status(400).send(errorResponder(error)));
    },

    create(req, res) {
        return Follow
            .create({
                followerId: req.auth.id,
                userId: req.params.userId
            })
            .then((follow) => res.status(201).send(successResponder(follow)))
            .catch((error) => res.status(400).send(errorResponder(error)));
    },

    destroy(req, res) {
        return Follow
            .findById(req.params.id)
            .then(follow => {
                if (!follow) {
                    return res.status(404).send(errorResponder({
                        message: 'Follow not found.',
                    }));
                }
                
                if (req.auth.role !== "admin" && req.auth.id !== follow.followerId) {
                    return res.status(403).send(errorResponder('User not authorized.'));
                }

                return follow
                    .destroy()
                    .then(() => res.status(204).send(successResponder(true)))
                    .catch(error => res.status(400).send(errorResponder(error)));
            })
            .catch(error => res.status(400).send(errorResponder(error)));
    }
};
