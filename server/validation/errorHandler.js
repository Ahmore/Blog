const { validationResult } = require('express-validator/check');

module.exports = (req, res, next) => {
    const errors = validationResult(req).array();

    if (errors.length > 0) {
        return res.status(404).send({
            errors: errors.map(element => {
                let error = {
                    ...element,
                    message: element.msg,
                };

                delete error.msg;

                return error;
            }),
        });
    }

    next();
};
