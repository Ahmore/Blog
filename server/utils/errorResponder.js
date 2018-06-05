module.exports = (...errors) => {
    return {
        errors: errors.map(error => {
            if (typeof error === "string") {
                return {
                    message: error,
                };
            }
            else if (error instanceof Error) {
                return {
                    message: String(error),
                };
            }
            else {
                return {
                    ...error,
                };
            }
        }),
    };
};
