const User = require('../models').User;
const Post = require('../models').Post;
const Comment = require('../models').Comment;
const sequelize = require('sequelize');
const errorResponder = require('./../utils/errorResponder');
const successResponder = require('./../utils/successResponder');

module.exports = {
    getPostComments(req, res) {
        return Comment
            .count({
                where: {
                    postId: req.params.postId
                }
            })
            .then((amount) => {
                return Comment
                    .findAll({
                        where: {
                            postId: req.params.postId
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
                    .then((comments) => res.status(200).send(successResponder(comments, amount)))
                    .catch((error) => res.status(400).send(errorResponder(error)));
            })
            .catch((error) => res.status(400).send(errorResponder(error)));
    },

    create(req, res) {
        return Comment
            .create({
                text: req.body.text,
                postId: req.params.postId,
                authorId: req.auth.id
            })
            .then((comment) => res.status(201).send(successResponder(comment)))
            .catch((error) => res.status(400).send(errorResponder(error)));
    },

    update(req, res) {
        return Comment
            .findById(req.params.id)
            .then(comment => {
                if (!comment) {
                    return res.status(404).send(errorResponder('Comment not found.'));
                }

                let text = req.body.text;

                return comment
                    .update({
                        text: text
                    })
                    .then(updatedComment => res.status(200).send(successResponder(updatedComment)))
                    .catch(error => res.status(400).send(errorResponder(error)));
            })
            .catch(error => res.status(400).send(errorResponder(error)));
    },

    destroy(req, res) {
        return Comment
            .findById(req.params.id)
            .then(comment => {
                if (!comment) {
                    return res.status(404).send(errorResponder({
                        message: 'Comment not found.',
                    }));
                }

                return comment
                    .destroy()
                    .then(() => res.status(204).send(successResponder(true)))
                    .catch(error => res.status(400).send(errorResponder(error)));
            })
            .catch(error => res.status(400).send(errorResponder(error)));
    }
};
