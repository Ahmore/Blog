module.exports = {
    login: {
        access_token: {
            errorMessage: "Access token is required.",
            exists: true,
        },
    },

    user: {
        role: {
            errorMessage: "Role is required.",
            exists: true,
        },
    },

    post: {
        text: {
            errorMessage: "Text is required.",
            exists: true,
        },
    },

    comment: {
        text: {
            errorMessage: "  is required.",
            exists: true,
        },
    },
};
