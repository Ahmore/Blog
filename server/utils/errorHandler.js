module.exports = function (err, req, res, next) {
    if (err) {
        res.status(404).send({
            errors: err
        });
    }

    next();
}