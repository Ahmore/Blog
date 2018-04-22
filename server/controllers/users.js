const User = require('../models').User;
const sequelize = require('sequelize');
const errorResponder = require('./../utils/errorResponder');
const successResponder = require('./../utils/successResponder');

module.exports = {
    getAll(req, res) {
        return User
            .count()
            .then((amount) => {
                return User
                    .findAll({
                        attributes: ['id', 'email', 'role', 'createdAt', 'updatedAt'],
                        order: [
                            ['createdAt', 'DESC'],
                        ],
                        offset: req.body.offset,
                        limit: req.body.limit
                    })
                    .then((users) => res.status(200).send(successResponder(users, amount)))
                    .catch((error) => res.status(400).send(errorResponder(error)));
            })
            .catch((error) => res.status(400).send(errorResponder(error)));
    },

    get(req, res) {
        return User
            .findById(req.params.id, {
                attributes: ['id', 'email', 'role', 'createdAt', 'updatedAt'],
            })
            .then((user) => {
                if (!user) {
                    return res.status(404).send(errorResponder('User not found.'));
                }
                return res.status(200).send(successResponder(user));
            })
            .catch((error) => res.status(400).send(errorResponder(error)));
    },

    update(req, res) {
        return User
            .findById(req.params.id)
            .then(user => {
                if (!user) {
                    return res.status(404).send(errorResponder('User not found.'));
                }

                let role = req.body.role;

                return user
                    .update({
                        role: role
                    })
                    .then(updatedUser => res.status(200).send(successResponder(updatedUser)))
                    .catch(error => res.status(400).send(errorResponder(error)));
            })
            .catch(error => res.status(400).send(errorResponder(error)));
    },

    destroy(req, res) {
        return User
            .findById(req.params.id)
            .then(user => {
                if (!user) {
                    return res.status(404).send(errorResponder('User not found.'));
                }

                return user
                    .destroy()
                    .then(() => res.status(204).send(successResponder(true)))
                    .catch(error => res.status(400).send(errorResponder(error)));
            })
            .catch(error => res.status(400).send(errorResponder(error)));
    }
};
