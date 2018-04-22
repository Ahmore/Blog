const User = require('../models').User;
const Post = require('../models').Post;
const Comment = require('../models').Comment;
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
    getAll(req, res) {
        // TODO
        // return Post
        //     .count()
        //     .then((amount) => {
        //         return Post
        //             .findAll({
        //                 // include: [User],
        //                 include: [{
        //                     model: Comment,
        //                     as: 'comments',
        //                 }],
        //                 // attributes: ['id', 'text', 'createdAt', 'updatedAt'],
        //                 order: [
        //                     ['createdAt', 'DESC'],
        //                 ],
        //                 offset: req.body.offset,
        //                 limit: req.body.limit
        //             })
        //             .then((posts) => res.status(200).send(successResponder(posts, amount)))
        //             .catch((error) => res.status(400).send(errorResponder(error)));
        //     })
        //     .catch((error) => res.status(400).send(errorResponder(error)));


        return sequelize.query("SELECT COUNT(*) FROM \"Posts\" WHERE \"Posts\".\"authorId\" IN (SELECT \"Follows\".\"userId\" FROM \"Follows\" INNER JOIN \"Users\" ON \"Follows\".\"userId\" = \"Users\".\"id\" WHERE \"Follows\".\"followerId\" = :followerId) OR  \"Posts\".\"authorId\" = :followerId", { 
            replacements: { 
                followerId: 1, // ID logged user
            },
            type: Sequelize.QueryTypes.SELECT
        })
        .then(data => {
            return sequelize.query("SELECT * FROM \"Posts\" WHERE \"Posts\".\"authorId\" IN (SELECT \"Follows\".\"userId\" FROM \"Follows\" INNER JOIN \"Users\" ON \"Follows\".\"userId\" = \"Users\".\"id\" WHERE \"Follows\".\"followerId\" = :followerId) OR  \"Posts\".\"authorId\" = :followerId LIMIT :limit OFFSET :offset", { 
                replacements: { 
                    followerId: 1, // ID logged user
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

    getUserPosts(req, res) {
        return Post
            .count({
                where: {
                    authorId: req.params.userId
                }
            })
            .then((amount) => {
                return Post
                    .findAll({
                        where: {
                            authorId: req.params.userId
                        },
                        include: [{
                            model: User,
                            attributes: ['id', 'email', 'role'],
                        }],
                        attributes: ['id', 'text', 'createdAt', 'updatedAt'],
                        order: [
                            ['createdAt', 'DESC'],
                        ],
                        offset: req.body.offset,
                        limit: req.body.limit
                    })
                    .then((posts) => res.status(200).send(successResponder(posts, amount)))
                    .catch((error) => res.status(400).send(errorResponder(error)));
            })
            .catch((error) => res.status(400).send(errorResponder(error)));
    },

    create(req, res) {
        return Post
            .create({
                text: req.body.text,
                authorId: 1 // ID logged user
            })
            .then((post) => res.status(201).send(successResponder(post)))
            .catch((error) => res.status(400).send(errorResponder(error)));
    },

    update(req, res) {
        return Post
            .findById(req.params.id)
            .then(post => {
                if (!post) {
                    return res.status(404).send(errorResponder('Post not found.'));
                }

                let text = req.body.text;

                return post
                    .update({
                        text: text
                    })
                    .then(updatedPost => res.status(200).send(successResponder(updatedPost)))
                    .catch(error => res.status(400).send(errorResponder(error)));
            })
            .catch(error => res.status(400).send(errorResponder(error)));
    },

    destroy(req, res) {
        return Post
            .findById(req.params.id)
            .then(post => {
                if (!post) {
                    return res.status(404).send(errorResponder('Post not found.'));
                }

                return post
                    .destroy()
                    .then(() => res.status(204).send(successResponder(true)))
                    .catch(error => res.status(400).send(errorResponder(error)));
            })
            .catch(error => res.status(400).send(errorResponder(error)));
    }
};
