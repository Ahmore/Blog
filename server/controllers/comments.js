const User = require('../models').User;
const Post = require('../models').Post;
const Comment = require('../models').Comment;
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
                        offset: req.query.offset,
                        limit: req.query.limit
                    })
                    .then((comments) => res.status(200).send(successResponder(comments, amount)))
                    .catch((error) => res.status(400).send(errorResponder(error)));
            })
            .catch((error) => res.status(400).send(errorResponder(error)));
    },

    create(req, res) {
        return Post
            .findById(req.params.postId)
            .then(post => {
                if (!post) {
                    return res.status(404).send(errorResponder('Post not found.'));
                }

                return Comment
                    .create({
                        text: req.body.text,
                        postId: req.params.postId,
                        authorId: req.auth.id
                    })
                    .then((comment) => res.status(201).send(successResponder(comment)))
                    .catch((error) => res.status(400).send(errorResponder(error)));
            });
    },

    update(req, res) {
        return Comment
            .findById(req.params.id)
            .then(comment => {
                if (!comment) {
                    return res.status(404).send(errorResponder('Comment not found.'));
                }
                
                if (req.auth.role !== "admin" && req.auth.id !== comment.authorId) {
                    return res.status(403).send(errorResponder('User not authorized.'));
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
                    return res.status(404).send(errorResponder('Comment not found.'));
                }
                
                if (req.auth.role !== "admin" && req.auth.id !== comment.authorId) {
                    return res.status(403).send(errorResponder('User not authorized.'));
                }

                return comment
                    .destroy()
                    .then(() => res.status(204).send(successResponder(true)))
                    .catch(error => res.status(400).send(errorResponder(error)));
            })
            .catch(error => res.status(400).send(errorResponder(error)));
    }
};
